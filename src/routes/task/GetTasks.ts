import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface NewTaskResponse {
	message: string
}

/**
 * Returns the cared user of the requester, if it exists
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const getTask = async (
	_req: Request, 
	res: Response<NewTaskResponse>, 
	_next: NextFunction): Promise<void|Response<NewTaskResponse>> => 
{
	return res.status(StatusCodes.OK).send({
		message: "GET Tasks"
	});
}