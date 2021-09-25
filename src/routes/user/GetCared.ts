import { User } from "@/models/User";
import * as UserService from "@/services/UserService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LeanDocument } from "mongoose";

interface GetCaredResponse {
	cared: LeanDocument<User>
}

/**
 * Returns the cared user of the requester, if it exists
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const cared = async (
	req: Request, 
	res: Response<GetCaredResponse>, 
	next: NextFunction): Promise<void|Response<GetCaredResponse>> => 
{
	return UserService.getCared(req.sessionId)
		.then((result) => res.status(StatusCodes.OK).send({ cared: result }))
		.catch(next);
}