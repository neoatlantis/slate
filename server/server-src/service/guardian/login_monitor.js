/*
Watch for USB insertion or removal.
*/
import _ from "lodash";
import { channel } from "app/lib/endpoints";
const debug = require("app/debug")("service/guardian/usb_monitor.js");

const shell_command = require("app/lib/shell_command");

const INTERVAL = 500;
const CHANGED_EVENT_NAME = "service.guardian.login_monitor.changed";
channel(CHANGED_EVENT_NAME);


async function last(){
	let result = await shell_command("last");
	let stdout = _.get(result, "stdout");
	return stdout;
}

let previous_last = "";


async function refresh_last(){
	try{
		let new_last = await last();
		if(new_last == previous_last) return;
		// change detected
		channel(CHANGED_EVENT_NAME).trigger();
		previous_last = new_last;
	} catch(e){
		debug("Failed on last(): " + e);
		return;
	}
	
}


const monitor = async ()=>{
	try{
		await refresh_last();
	} catch(e){
		debug("Failed monitoring last: " + e);
	} finally {
		setTimeout(monitor, INTERVAL);
	}
}
monitor();