import "./pbkdf2.js";
import { channel, call, register } from "app/lib/endpoints";
const { subtle } = globalThis.crypto;


async function unlock_engine({ password, seed }){
	let key = await call(
		"service.pwmgr.pbkdf2",
		{ password, salt: "", iterations: 1000000 }
	);

}

async function calculate_hmac({ data }){

}

async function lock_engine(){

}

async function get_engine_status(){

}

register("service.pwmgr.engine.hash", calculate_hmac);
register("service.pwmgr.engine.status", get_engine_status);
register("service.pwmgr.engine.unlock", unlock_engine);
register("service.pwmgr.engine.lock", lock_engine);

channel("service.guardian.change_detected").on(lock_engine);

