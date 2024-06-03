/*
Watch for USB insertion or removal.
*/
import _ from "lodash";
import { channel } from "app/lib/endpoints";
const debug = require("app/debug")("service/guardian/usb_monitor.js");

const shell_command = require("app/lib/shell_command");

const INTERVAL = 500;
const CHANGED_EVENT_NAME = "service.guardian.usb_monitor.changed";
channel(CHANGED_EVENT_NAME);


async function lsusb(){
	let result = await shell_command("lsusb");
	let stdout = _.get(result, "stdout");

	if(_.isNil(stdout)) throw Error();

	let ret = _.compact(stdout.split("\n").map(e=>e.trim()));
	return new Set(ret);
}

let previous_lsusb_set = new Set([]);

function compare_set(a, b){
	return (
		a.size == b.size &&
		[...a].every((x)=>b.has(x))
	);
}

async function refresh_usb(){
	try{
		let new_set = await lsusb();
		if(compare_set(new_set, previous_lsusb_set)) return; // equality
		// change detected
		channel(CHANGED_EVENT_NAME).trigger();
		previous_lsusb_set = new_set;
	} catch(e){
		debug("Failed on lsusb(): " + e);
		return;
	}
	
}


const monitor = async ()=>{
	try{
		await refresh_usb();
	} catch(e){
		debug("Failed monitoring usb: " + e);
	} finally {
		setTimeout(monitor, INTERVAL);
	}
}
monitor();