 import { register } from "app/lib/endpoints";
const crypto = require("crypto");


function pbkdf2({ password, salt, iterations, length }){
	return new Promise((resolve, reject)=>{
		crypto.pbkdf2(
			password,
			salt,
			iterations,
			length,
			'sha512',
			(err, value)=>{
				if(err) return reject(err);
				return resolve(value);
			}
		);
	});
}

register("service.pwmgr.pbkdf2", pbkdf2);