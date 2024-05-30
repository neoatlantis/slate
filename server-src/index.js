import api from "app/api";
const debug = require("debug")(APPNAME+"/index.js");

const express = require("express");
const app = express();



debug("Setting up express.js");

app.use("/api", api);




const http = require("http").createServer(app);

http.on("listening", ()=>{
	debug(PROGRAM_NAME + " listening on 8080.");
});

http.listen(8080, "localhost");