/**
 * Whole package to manage and verificate a session open in this service
 */
export interface SessionPackage {
	auth: string,
	refresh: string,
	expiration: number
}