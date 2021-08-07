import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppAuthCredentials } from "@/interfaces";
import { msg_invalid_google_id } from "@/shared/strings"; 
import { getUserByGoogleId } from "@/services/UserService";

/**
 * Checks the GoogleId of the user and if it's valid returns a response
 * with the application user details.
 * In case that the user doesn't have an application account, create a
 * new one to return.
 * @param req request with the Google credentials
 * @param res carried response
 * @returns response with the user account details
 */
export const login = async (req: Request<unknown, unknown, AppAuthCredentials>, 
	res: Response): Promise<Response> => {
	// Retrieve the credentials	
	const credentials = req.body;
	if (!credentials.id) {
		// TODO implement error handling
		return res.status(StatusCodes.BAD_REQUEST)
				.json({ message: msg_invalid_google_id });
	}
	// TODO validate token with google
	// If the id is valid, get the user to return
	return getUserByGoogleId(credentials)
		.then((user) => res.status(StatusCodes.OK).send(user))
		.catch((e: Error) => {
			throw e;
		});
}