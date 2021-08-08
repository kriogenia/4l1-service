import * as jwt from "jsonwebtoken";

/**
 * Generates a pair of auth and refresh tokens with the auth expiration time
 * @param id of the user
 * @returns object with the both tokens and expiring time
 */
export const generatePair = (id: string) => {
	const auth =  authToken(id);
	const refresh = refreshToken(id);
	const expiration = (jwt.decode(auth) as jwt.JwtPayload).exp;
	// store the tokens
	return {
		auth: auth,
		refresh: refresh,
		expiration: expiration
	}
}

/**
 * Synchronously generates an authentication token for the user to use
 * @param id of the user
 * @returns auth token
 */
 const authToken = (id: string): string => {
	const { AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRATION_TIME } = process.env;
	return jwt.sign(
			{ sessionId : id }, 
			AUTH_TOKEN_SECRET, 
			{ expiresIn: AUTH_TOKEN_EXPIRATION_TIME }
	);
}

/**
 * Synchronously generates an refresh token for the user to use
 * @param id of the user
 * @returns refresh token
 */
 const refreshToken = (id: string): string => {
	const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION_TIME } = process.env;
	return jwt.sign(
			{ sessionId : id }, 
			REFRESH_TOKEN_SECRET, 
			{ expiresIn: REFRESH_TOKEN_EXPIRATION_TIME }
	);
}

// TODO database clean up function