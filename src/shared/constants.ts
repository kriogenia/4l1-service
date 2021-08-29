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

export const msg_update_completed = "The specified user has been updated successfully";
export const msg_bonding_completed = "The bond has been established";