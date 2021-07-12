import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from "./tsconfig.json";
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	modulePaths: [
		"<rootDir>"
	]
}

export default config;