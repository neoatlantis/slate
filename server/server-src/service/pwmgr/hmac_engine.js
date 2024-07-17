import _ from "lodash";
import "./pbkdf2.js";
import { channel, call, register } from "app/lib/endpoints";
import { readFile } from "fs/promises";
import buffer from "buffer";
import deterministic_stringify from "json-stringify-deterministic";

const debug = require("app/debug")("service/pwmgr/hmac_engine.js");


let seed_data = null;
let master_key = null;

async function load_seed({ seed_path }){
	await lock_engine();
	seed_data = await readFile(seed_path);
	debug("Seed loaded from: " + seed_path);
}




async function unlock_engine({ password }){
	if(!_.isNil(master_key)) return true;
	master_key = await call(
		"service.pwmgr.seed.decrypt", { password, seed: seed_data });
	password = "";
	if(global.gc){
		debug("Calling garbage collection...");
		global.gc();
	}
	return true;
}

async function calculate_hmac({ data }){
	if(_.isNil(master_key)){
		throw Error("HMAC engine not ready.");
	}
	if(!_.isBuffer(data)){
		throw Error("data expected to be a buffer.");
	}
	return await crypto.subtle.sign("HMAC", master_key, data);
}


async function derive_key({ salt, usage, algorithm }){
	if(!_.isString(usage) && !_.isNil(usage)){
		throw Error("usage expected to be a buffer.")
	}
	if(_.isNil(usage)) usage = "";
	if(!/^[\x20-\x7e]{0,}$/.test(usage)) {
		throw Error("usage must be in ASCII.");
	}

	let seed = await calculate_hmac({ data: salt });

	const secret_key = await crypto.subtle.importKey(
    	'raw',
    	seed,
    	{ name: 'HKDF' },
    	false,
    	['deriveKey']
  	);

  	const hkdf_params = {
    	name: 'HKDF',
    	hash: 'SHA-256',
    	salt,
    	info: new Uint8Array(buffer.Buffer.from(deterministic_stringify({
    		algorithm,
    		usage,
    	}), 'ascii')),
  	};

	return await crypto.subtle.deriveKey(
	    hkdf_params,
	    secret_key,
	    algorithm,
	    false,
	    ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey']
	);
}


async function lock_engine(){
	debug("Locking engine...");
	master_key = null;
	if(global.gc){
		debug("Calling garbage collection...");
		global.gc();
	}
	return true;
}

async function get_engine_status(){
	return {
		unlocked: !_.isNil(master_key),
	}
}

register("service.pwmgr.engine.load", load_seed);
register("service.pwmgr.engine.hash", calculate_hmac);
register("service.pwmgr.engine.derivekey", derive_key);
register("service.pwmgr.engine.status", get_engine_status);
register("service.pwmgr.engine.unlock", unlock_engine);
register("service.pwmgr.engine.lock", lock_engine);

channel("service.guardian.change_detected").on(lock_engine);

