import express from "express";
import http from "http";
import { register, call } from "app/lib/endpoints";

const debug = require("app/debug")("service/www-interface/index.js");

let www_interface_started = false;

function start_www_interface(){

	const www_interface = express();


	debug("Setting up www interface...");
	//www_interface.use("/api", api);




	const server = http.createServer(www_interface);

	server.on("listening", ()=>{
		debug("WWW interface started, listening on 0.0.0.0:8199.");
	});

	server.listen(8199, "0.0.0.0");
	return server;

}


register("service.www-interface.start", async function(){
	if(false !== www_interface_started) return;
	www_interface_started = start_www_interface();
});