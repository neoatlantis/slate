import parse_args from "./cli-args";

import command_start from "app/startup-commands/start";
import command_makeseed from "app/startup-commands/makeseed";


const debug = require("app/debug")("index.js");




const args = parse_args();

switch(args.command){
case "start": command_start(args); break;
case "makeseed": command_makeseed(args); break;


}