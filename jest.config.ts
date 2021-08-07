import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions } from "./tsconfig.json";
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
	modulePaths: [
		"<rootDir>"
	],
	setupFiles: [
		"<rootDir>/__tests__/util/test.config.ts"
	],
	testPathIgnorePatterns: [
		"<rootDir>/__tests__/util/*"
	]
}

export default config;