import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; 
import * as UserService from "@/services/UserService";
import * as GoogleAuth from "@/services/GoogleAuth";
import * as TokenService from "@/services/TokenService";
import { SessionDto, UserDto } from "@/models/dto";

interface SignInParams {
	token: string
}

interface SignInResponse {
	session: SessionDto,
	user: UserDto
}

/**
 * Checks the GoogleIdToken of the user and if it's valid returns a response
 * with the application user details.
 * In case that the user doesn't have an application account, create a
 * new one to return.
 * @param req request with the Google credentials
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns the sending response with the session package or error message
 */
export const signIn = async (
	req: Request<SignInParams>, 
	res: Response<SignInResponse>, 
	next: NextFunction): Promise<void|Response<SignInResponse>> => 
{
	// Verify the Google token
	return GoogleAuth.verify(req.params.token)
		.then(UserService.getByGoogleId)	// And get the user to return
		.then((user) => {
			return res.status(StatusCodes.OK).json({
				session: TokenService.sessionPackage(user.id),
				user: user.dto()
			}).send();
		})
		.catch(next);
}