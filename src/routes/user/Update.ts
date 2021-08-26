import { Role } from "@/models/User";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface UpdateBody {
	displayName?: string,
	role?: Role,
	mainPhoneNumber?: string,
	altPhoneNumber?: string,
	//address?: Address,
	email?: string
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
	console.log({req})
	return res.status(StatusCodes.OK).send({
		message: "The specified user has been updated succesfully"
	})
}