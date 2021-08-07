import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { msg_invalid_google_id } from "@/shared/strings"; 
import * as UserService from "@/services/UserService";
import { badRequestError } from "@/shared/errors";
import * as GoogleAuth from "@/services/GoogleAuth";
import { generatePair } from "@/services/TokenService";

interface SignInParams {
	token: string
}

/**
 * Checks the GoogleIdToken of the user and if it's valid returns a response
 * with the application user details.
 * In case that the user doesn't have an application account, create a
 * new one to return.
 * @param req request with the Google credentials
 * @param res carried response
 * @returns response with the user account details
 */
export const signIn = async (req: Request<SignInParams>, res: Response, 
	next: NextFunction): Promise<void|Response> => 
{
	// Retrieve the token	
	const token = req.params.token;
	if (!token) {
		return next(badRequestError(msg_invalid_google_id));
	}
	// Verify the Google token
	return GoogleAuth.verify(token).then((userId) =>
		// If the id is valid, get the user to return
		UserService.getUserByGoogleId(userId)
			.then((user) => {
				// Return the user and the session tokens
				const tokens = generatePair(user.id);
				return res.status(StatusCodes.OK).json({
					...tokens,
					user: user.toJSON()
				}).send();
			})
			.catch(next)
		).catch(next);
}