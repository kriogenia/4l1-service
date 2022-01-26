import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; 
import * as SessionService from "@/services/SessionService";
import * as TokenService from "@/services/TokenService";

interface SignOutParams {
	token: string
}

/**
 * Closes the session assigned to the given authentication token.
 * @param req request with the authentication token
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns the sending response
 */
export const signOut = async (
	req: Request<SignOutParams>, 
	res: Response, 
	next: NextFunction): Promise<void|Response> => 
{
	const auth = req.params.token;
	if (TokenService.extractId(auth) != req.sessionId) {
		return res.status(StatusCodes.FORBIDDEN).send();
	}
	return SessionService.closeSession(req.params.token)
		.then(() => res.status(StatusCodes.NO_CONTENT).send())
		.catch(next);
}