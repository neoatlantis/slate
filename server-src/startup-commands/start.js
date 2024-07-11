import path from "path";
import express from "express";
import api from "app/api";
import "app/service";
import { call } from "app/lib/endpoints";

const debug = require("app/debug")("index.js");


export default async function(args){

	await call("service.pwmgr.engine.load", { seed_path: args.seed });




	const app = express();


	debug("Setting up express.js");
	app.use("/api", api);

	debug("Setting up ui.");
	const static_path = path.join(
		__dirname,
	    PROGRAM_PREFIX + "-" + (DEV?"web-dev":"web")
	);
	app.use(express.static(static_path));




	const http = require("http").createServer(app);

	http.on("listening", ()=>{
		debug(PROGRAM_NAME + " listening on 8080.");
	});

	http.listen(8080, "localhost");

}