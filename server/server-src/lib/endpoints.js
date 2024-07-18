import { BroadcastChannel } from 'broadcast-channel';
const debug = require("app/debug")("lib/endpoints.js");



const endpoints = new Map();
const channels = new Map();

function register(name, func){
	if(endpoints.has(name)) throw Error("Endpoint already registered.");
	endpoints.set(name, func);
	debug("Register endpoint: " + name);
}

function call(name, ...args){
	if(!endpoints.has(name)) throw Error("Endpoint not yet registered.");
	debug("Call on endpoint: " + name);
	return endpoints.get(name).apply(this, args);
}

class Channel {
	#name;
	#listeners;
	constructor(name){
		this.#name = name;
		this.#listeners = [];
		
	}

	on(func){
		this.#listeners.push(func);
	}

	trigger(data){
		debug("Recevied event:" + this.#name);
		this.#listeners.forEach((func)=>{
			func(data);
		});
	}
}

function channel(name){
	if(channels.has(name)) return channels.get(name);
	debug("Channel creation: " + name);
	let new_channel = new Channel(name);
	channels.set(name, new_channel);
	return new_channel;
}

export { register, call, channel };