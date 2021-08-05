import { Request, Response } from "express";
import * as core from "express-serve-static-core";

/**
 * Model of the app authentication credentials
 * @property {string?} givenName of the user
 * @property {string?} familyName of the user
 * @property {string} id GoogleIdToken of the user
 */
interface AppAuthCredentials {
	givenName?: string,
	familyName?: string,
	id?: string
}

export const validateCredentials = (req: Request<unknown, unknown, AppAuthCredentials>, 
	res: Response): Response => {
	// Retrieve the credentials	
	const credentials = req.body;
	console.log(credentials.id);
	console.log(credentials.givenName);
	console.log(credentials.familyName);
	return res.status(200).send({auth: "Auth"});
}