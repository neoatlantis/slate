import { ArgumentParser } from "argparse";

const parser = new ArgumentParser({
	description: `NeoAtlantis slate is like another password manager, but is
	intended for running on a standalone portable computer near the end user.
	`,
});

parser.add_argument("command", {
	type: "str",
	choices: ["start", "makeseed", "reencryptseed"],
});

parser.add_argument("--seed", {
	help: 'Path to seed file. Required when using <reencryptseed> or <start> as command.',
})

export default function (){ return parser.parse_args() };