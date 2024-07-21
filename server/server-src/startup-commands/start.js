import path from "path";
import { Server as SocketIOServer } from "socket.io";
import express from "express";
import api from "app/api";
import "app/service";
import { call, register } from "app/lib/endpoints";
import on_connection from "app/socketio";
import http from "http";

const debug = require("app/debug")("index.js");


export default async function(args){

	await call("service.pwmgr.engine.load", { seed_path: args.seed });
	await call("service.www-interface.start");



	const app = express();
	const server = http.createServer(app);
	const io = new SocketIOServer(server);


	debug("Setting up express.js");
	app.use("/api", api);

	debug("Setting up ui.");
	const static_path = path.join(
		__dirname,
	    PROGRAM_PREFIX + "-" + (DEV?"web-dev":"web")
	);
	app.use(express.static(static_path));




	
	server.on("listening", ()=>{
		debug(PROGRAM_NAME + " listening on 8080.");
	});

	io.on("connection", on_connection);
	register("socketio.broadcast", function(){
		io.emit.apply(this, [...arguments]);
	});

	server.listen(8080, "localhost");

}