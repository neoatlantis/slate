import api from "app/api";
import express from "express";
import "app/service";


export default async function(args){
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