import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface UpdateBody {
	name: string,
	role: string
}

interface UpdateResponse {
	message: string
}

/**
 * Updates the information of the current user
 * @param req 
 * @param res 
 * @param _next 
 * @returns 
 */
export const update = /*async*/ (
	req: Request<unknown, unknown, UpdateBody>, 
	res: Response<UpdateResponse>, 
	_next: NextFunction): /*Promise<void|*/Response<UpdateResponse>/*>*/ => 
{
	const {name, role} = req.body;
	console.log(`Triggered update with ${name} and ${role}`);
	// Check name and role, transform role
	// User service -> update user -> then respond
	return res.status(StatusCodes.OK).send({
		message: "The specified user has been updated succesfully"
	})
}