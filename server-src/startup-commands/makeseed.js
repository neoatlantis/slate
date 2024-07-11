import "app/service/pwmgr";
import { call } from "app/lib/endpoints";
import rls from "readline-sync";
 
 


export default async function(args){
	console.error("This will generate a new seed for starting the slate.");

	let password1 = rls.question("Type a password for protecting the seed: ", {
		hideEchoBack: true,
	});

	let password2 = rls.question("Type above password again: ", {
		hideEchoBack: true,
	});

	if(password1 != password2){
		console.error("Passwords mismatch. Please try again.");
		process.exit(1);
	}

	let seed = await call("service.pwmgr.seed.make", { password: password1 });
	console.log(seed);

	process.exit();
}