import path from "path";
import { config } from "dotenv";
import commandLineArgs from "command-line-args";
 
(() => {
	// Setup command line options to specify environment
	const options = commandLineArgs([
		{
			name: "env",
			alias: "e",
			defaultValue: "development",
			type: String,
		},
	]);
	const env: string = options.env;
	// Set the env file
	const result = config({
		path: path.join(__dirname, `env/${env}.env`),
	});
	if (result.error) {
		throw result.error;
	}
})();