import _ from "lodash";
import "./pbkdf2.js";
import { channel, call, register } from "app/lib/endpoints";
import { serialize, deserialize } from "@ygoe/msgpack";

const buffer = require("buffer");

/// #if DEV
const ITERATIONS_LOWER_BOUND = 100000;
/// #else
const ITERATIONS_LOWER_BOUND = 1000000;
/// #endif


const MASTER_KEY_ALGO = {
	hash: 'SHA-256',
	length: 256,
	name: 'HMAC',
};



async function get_wrapping_key({ password, salt, iterations }){
	if(!_.isString(password) && !_.isBuffer(password)){
		throw Error("KDF expects password a string or buffer.");
	}
	if(!_.isString(salt) && !_.isBuffer(salt)){
		throw Error("KDF expects salt a string or buffer.");
	}
	if(!_.isInteger(iterations) || iterations < ITERATIONS_LOWER_BOUND){
		throw Error(
			"KDF expects iterations an integer no less than " + 
			ITERATIONS_LOWER_BOUND + "."
		);
	}

	let key = await call(
		"service.pwmgr.pbkdf2",
		{ password, salt, iterations, length: 32 }
	);

	let cryptokey = await crypto.subtle.importKey(
		"raw",
		key,
		"AES-KW",
		false,
		["wrapKey", "unwrapKey"]
	);

	crypto.getRandomValues(key);

	return cryptokey;
}


async function get_new_wrapping_key({ password }){
	let salt = buffer.Buffer.alloc(32);
	crypto.getRandomValues(salt);

	const iterations = ITERATIONS_LOWER_BOUND * 2;

	let wrapping_key = await get_wrapping_key({ password, salt, iterations });
	return { wrapping_key, salt, iterations };
}


async function export_master_key_as_seed({
    master_key, wrapping_key, salt, iterations
}){
	let exported_key = buffer.Buffer.from(await crypto.subtle.wrapKey(
		"jwk",
		master_key,
		wrapping_key,
		"AES-KW"
	));

	return buffer.Buffer.from(
		serialize([exported_key, salt, iterations ])
	).toString("base64");
}


async function make_seed({ password }){
	let { wrapping_key, salt, iterations } = 
		await get_new_wrapping_key({ password });

	let master_key = await crypto.subtle.generateKey(
		MASTER_KEY_ALGO,
		true,
		["sign"]
	);

	return await export_master_key_as_seed({
		master_key, wrapping_key, salt, iterations,
	});
}



async function __decrypt_seed({ password, seed }, extractable){
	// Decrypt the seed and get a master crypto key.
	//
	// If we make the key extractable, it might be later imported into TPM...
	// It's verified that raw export of the master key is simply THE secret in
	// doing HMAC (with specified algorithm, of course).

	let seed_args = null;
	try{
		seed_args = deserialize(buffer.Buffer.from(seed, "base64"));
	} catch(e){
		throw Error("Failed reading seed.");
	}

	let exported_key = _.get(seed_args, 0),
		salt = _.get(seed_args, 1),
		iterations = _.get(seed_args, 2);

	let wrapping_key = await get_wrapping_key({ password, salt, iterations });

	try{
		let master_key = await crypto.subtle.unwrapKey(
			"jwk",
			exported_key,
			wrapping_key,
			"AES-KW",
			MASTER_KEY_ALGO,
			Boolean(extractable),
			["sign"],
		);
		return master_key;
	} catch(e){
		throw Error("Cannot unwrap key. Password wrong?");
	}
}

async function decrypt_seed(args){
	return __decrypt_seed(args, false);
}



async function reencrypt_seed({ password_old, password_new, seed }){
	let master_key = 
		await __decrypt_seed({ password: password_old, seed }, true);

	let { wrapping_key, salt, iterations } =
		await get_new_wrapping_key({ password: password_new });

	return await export_master_key_as_seed({
		master_key, wrapping_key, salt, iterations,
	});
}




/// #if DEV
async function test(){
	let seed = await make_seed({ password: 'test'});
	console.log("test seed 0: ", seed);

	let key0 = await decrypt_seed({ password: 'test', seed });

	let seed1 = await reencrypt_seed({ password_old: 'test', password_new: 'testnew', seed });
	console.log("test seed 1: ", seed1);
	let key1 = await decrypt_seed({ password: 'testnew', seed: seed1});

	console.log("verify key0 == key1");
	console.log(await crypto.subtle.sign("HMAC", key0, buffer.Buffer.from('test')));
	console.log(await crypto.subtle.sign("HMAC", key1, buffer.Buffer.from('test')));
}

//test();
/// #endif