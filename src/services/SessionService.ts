import { Session, SessionModel } from "@/models/Session";

/**
 * Creates a new session in the database
 * @param auth token
 * @param refresh token
 * @param expiration time of the refresh token
 * @returns Session created object
 */
export const startSession = async (auth: string, refresh: string, expiration: number): 
Promise<Session> => {
	return await SessionModel.create({
		refresh: refresh,
		auth: auth,
		expiration: expiration
	});
}

/**
 * Closes the session, deleting it from the database
 * @param token refresh token of the session to delete
 */
export const closeSession = (token: string): void => {
	SessionModel.remove({
		refresh: token
	});
}

/**
 * Checks if the specified session is currently open
 * @param token refresh token of the session to check
 * @returns true if the session is open, false otherwise
 */
 export const isSessionOpen = async (token: string): 
 Promise<boolean> => SessionModel.exists({ auth: token });

/**
 * Checks if the specified refresh session is currently open
 * @param token refresh token of the session to check
 * @returns true if the session is open, false otherwise
 */
export const isSessionRefreshable = async (token: string): 
Promise<boolean> => SessionModel.exists({ refresh: token });

/**
 * Search in the database any stored session with the provided auth token and refresh
 * token. If false is returned, then those two tokens are not currently related, that
 * probably means that the auth token is overwritten.
 * @param auth token
 * @param refresh token
 * @returns true if the session exists, false otherwise
 */
export const checkSessionTuple = async (auth: string, refresh: string): 
Promise<boolean> => {
	return new Promise((resolve, reject) => {
		SessionModel.findOne({ 
			refresh: refresh,
			auth: auth 
		}).exec(
			(err, result) => {
				if (err) return reject(err);
				resolve(result ? true : false);
			}
		);
	});
}