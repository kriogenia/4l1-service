/**
 * Model of the app authentication credentials
 * @property {string?} givenName of the user
 * @property {string?} familyName of the user
 * @property {string} id GoogleIdToken of the user
 */
 export interface AppAuthCredentials {
	givenName?: string,
	familyName?: string,
	id?: string
}