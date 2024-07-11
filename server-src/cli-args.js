import { ArgumentParser } from "argparse";
import _ from "lodash";

const parser = new ArgumentParser({
	description: `NeoAtlantis slate is like another password manager, but is
	intended for running on a standalone portable computer near the end user.
	`,
});

parser.add_argument("command", {
	type: "str",
	choices: ["start", "makeseed", "reencryptseed"],
});

parser.add_argument("--seed", "-s", {
	type: "str",
	help: 'Path to seed file. Required when using <reencryptseed> or <start> as command.',
})

export default function (){
	let args = parser.parse_args();

	if(args.command == "start" || args.command == "reencryptseed"){
		if(_.isNil(args.seed)){
			console.log("Error: --seed/-s SEED must be provided.");
			process.exit(1);
		}
	}


	return args;
};