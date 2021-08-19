import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { invalid_google_id } from "@/shared/errors/messages"; 
import * as UserService from "@/services/UserService";
import { badRequestError } from "@/shared/errors";
import * as GoogleAuth from "@/services/GoogleAuth";
import { generate } from "@/services/TokenService";
import { User } from "@/models/User";
import { LeanDocument } from "mongoose";
import { SessionPackage } from "@/interfaces";

interface SignInParams {
	token: string
}

interface SignInResponse {
	session: SessionPackage,
	user: LeanDocument<User>
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
export const signIn = async (
	req: Request<SignInParams>, 
	res: Response<SignInResponse>, 
	next: NextFunction): Promise<void|Response<SignInResponse>> => 
{
	// Retrieve the token	
	const token = req.params.token;
	if (!token) {
		return next(badRequestError(invalid_google_id));
	}
	// Verify the Google token
	return GoogleAuth.verify(token)
		.then(UserService.getUserByGoogleId)
		.then((user) => res.status(StatusCodes.OK).json({
				session: generate(user.id),
				user: user.toJSON()
			}).send())
		.catch(next);
}