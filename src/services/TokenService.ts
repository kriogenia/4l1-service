import { SessionPackage } from "@/interfaces";
import { badRequestError, ERR_MSG, unathorizedError } from "@/shared/errors";
import * as jwt from "jsonwebtoken";
import * as SessionService from "./SessionService";

/**
 * Content stored in the token
 */
interface TokenPayload extends jwt.JwtPayload {
	sessionId: string
}

/**
 * Generates a pair of auth and refresh tokens with the auth expiration time
 * @param id of the user
 * @returns object with the both tokens and expiring time
 */
export const generate = (id: string) : SessionPackage => {
	const { AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRATION_TIME } = process.env;
	const auth =  newToken(id, AUTH_TOKEN_SECRET, AUTH_TOKEN_EXPIRATION_TIME);
	const { REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION_TIME } = process.env;
	const refresh = newToken(id, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION_TIME);
	SessionService.startSession(auth, refresh, (jwt.decode(refresh) as TokenPayload).exp);
	return {
		auth: auth,
		refresh: refresh,
		expiration: (jwt.decode(auth) as TokenPayload).exp
	}
}

/**
 * Verifies the auth token and checks if it's still valid to use
 * @param token auth token to check
 * @returns true if it's valid, false otherwise
 */
export const checkAuth = async (token: string): Promise<boolean> => {
	return verifyToken(token, process.env.AUTH_TOKEN_SECRET)
		.then(() => SessionService.isSessionOpen(token));
}

/**
 * Checks if the token are valid and related to any active session
 * @param auth token of the session
 * @param refresh token of the session
 * @returns 
 */
export const checkTuple = (auth: string, refresh: string): Promise<boolean> => {
	return SessionService.checkSessionTuple(auth, refresh);
}

/**
 * Checks if the provided pair of tokens are valid and return a new pair in case
 * that they are, killing the previously stored session
 * @param auth 		Authentication token
 * @param refresh 	Refresh token
 * @returns 		New tokens and expiration time
 */
export const refresh = async (auth: string, refresh: string):
Promise<SessionPackage> => {
	return verifyToken(refresh, process.env.REFRESH_TOKEN_SECRET)
		.then(() => SessionService.isSessionRefreshable(refresh))
		.then((isRefreshable) =>{
			if (isRefreshable) {
				SessionService.closeSession(refresh);
				return generate(extractId(auth));
			}
			throw badRequestError(ERR_MSG.token_invalid);
		});
}

/**
 * Extracts and returns the sessionId stored in the token
 * @param token Token with the sessionId
 * @returns sessionId stored in the token
 */
export const extractId = (token: string): string => {
	return (jwt.decode(token) as TokenPayload).sessionId;
}

/**
 * Synchronously generates a new token with the provided info
 * @param id of the user
 * @returns JSON web token
 */
 const newToken = (id: string, secret: string, expiration: string): string => {
	return jwt.sign(
			{ 
				sessionId : id,
				time: Date.now()
			}, 
			secret, 
			{ expiresIn: expiration }
	);
}

const verifyToken = (token: string, secret: string): Promise<TokenPayload> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, token) => {
			if (err) {
				if (err instanceof jwt.TokenExpiredError) {
					return reject(unathorizedError(ERR_MSG.token_expired));
				}
				if (err instanceof jwt.JsonWebTokenError) {
					return reject(unathorizedError(ERR_MSG.token_invalid));
				}
				return reject(err);
			} else return resolve(token as TokenPayload);
		});
	});
}

// TODO database clean up function