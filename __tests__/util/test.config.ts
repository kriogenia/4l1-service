/* istanbul ignore file */
import { Environment } from "@/shared/enums";
import { config } from "dotenv";
import path from 'path';

// Set the env file
const result = config({
	path: path.join(__dirname, `../../src/pre-start/env/${Environment.TEST}.env`),
});
if (result.error) {
	throw result.error;
}