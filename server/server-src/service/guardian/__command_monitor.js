/*
Watch for USB insertion or removal.
*/
import _ from "lodash";
import { channel } from "app/lib/endpoints";

export default function template(filename, command){
	const debug = require("app/debug")(`service/guardian/${filename}.js`);

	const shell_command = require("app/lib/shell_command");

	const INTERVAL = 500;
	const CHANGED_EVENT_NAME = `service.guardian.${filename}.changed`;
	channel(CHANGED_EVENT_NAME);


	async function exec_command(){
		let result = await shell_command(command);
		let stdout = _.get(result, "stdout");

		if(_.isNil(stdout)) throw Error();

		let ret = _.compact(stdout.split("\n").map(e=>e.trim()));
		return new Set(ret);
	}

	let previous_set = new Set([]);

	function compare_set(a, b){
		return (
			a.size == b.size &&
			[...a].every((x)=>b.has(x))
		);
	}

	async function refresh_command(){
		try{
			let new_set = await exec_command();
			if(compare_set(new_set, previous_set)) return; // equality
			// change detected
			channel(CHANGED_EVENT_NAME).trigger();
			previous_set = new_set;
		} catch(e){
			debug(`Failed on ${command}(): ` + e);
			return;
		}
		
	}


	const monitor = async ()=>{
		try{
			await refresh_command();
		} catch(e){
			debug("Failed monitoring: " + e);
		} finally {
			setTimeout(monitor, INTERVAL);
		}
	}
	monitor();

}