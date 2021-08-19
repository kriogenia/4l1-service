import { SessionPackage } from "@/interfaces";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import * as jwt from "jsonwebtoken";

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
	const auth =  authToken(id);
	const refresh = refreshToken(id);
	const expiration = (jwt.decode(auth) as TokenPayload).exp;
	// store the tokens
	return {
		auth: auth,
		refresh: refresh,
		expiration: expiration
	}
}

/**
 * Checks if the provided pair of tokens are valid and return a new pair in case
 * that they are
 * @param auth 		Authentication token
 * @param refresh 	Refresh token
 * @returns 		New tokens and expiration time
 */
export const refresh = async (auth: string, refresh: string): Promise<SessionPackage> => {
	return verifyToken(refresh, process.env.REFRESH_TOKEN_SECRET)
		.then((refreshPayload) => {
			const authPayload = jwt.decode(auth) as TokenPayload;
			if (authPayload.sessionId !== refreshPayload.sessionId) {
				throw unathorizedError(ERR_MSG.tokens_not_related)
			}
			// TODO check the stored tokens -> TODO store the tokens
			// If they are valid, delete them and persist a new pair
			return generate(authPayload.sessionId);
		})
		.catch((err: Error) => {
			if (err instanceof jwt.TokenExpiredError) {
				throw unathorizedError(ERR_MSG.token_expired);
			}
			if (err instanceof jwt.JsonWebTokenError) {
				throw unathorizedError(ERR_MSG.token_invalid);
			}
			throw err;
		});
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

const verifyToken = (token: string, secret: string): Promise<TokenPayload> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, token) => {
			if (err) return reject(err);
			else return resolve(token as TokenPayload);
		});
	});
}

// TODO database clean up function