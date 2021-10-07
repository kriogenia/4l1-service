/**
 * Environments of the API
 */
export enum Environment {
	AZ = "azure",
	DEV = "development",
	PROD = "production",
	TEST = "test"
}

/**
 * Severity levels
 */
 export enum Severity {
    INFO = 1,
    IMP,
    WARN,
    ERR
}

export interface BasicResponse {
	message: string
}

export const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;