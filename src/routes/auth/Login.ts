import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserModel } from "@/models/User";
import { AppAuthCredentials } from "@/interfaces";
import { msg_invalid_google_id } from "@/shared/strings"; 

export const validateCredentials = async (req: Request<unknown, unknown, AppAuthCredentials>, 
	res: Response): Promise<Response<string>> => {
	// Retrieve the credentials	
	const credentials = req.body;
	if (!credentials.id) {
		// TODO implement error handling
		return res.status(StatusCodes.BAD_REQUEST)
				.json({ message: msg_invalid_google_id });
	}
	return UserModel.find({ googleId: credentials.id }).exec()
		.then(result => {
			if (result.length > 0) {
				console.log("return user");
			} else {
				return res.status(StatusCodes.OK).send({
					givenName: credentials.givenName,
					familyName: credentials.familyName,
					googleId: credentials.id,
					role: undefined
				});
			}
		})
		.catch();
}