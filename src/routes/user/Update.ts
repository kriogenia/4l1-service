import { User } from "@/models/User";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LeanDocument } from "mongoose";
import * as UserService from "@/services/UserService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { msg_update_completed } from "@/shared/constants";

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
export const update = async (
	req: Request<unknown, unknown, LeanDocument<User>>, 
	res: Response<UpdateResponse>, 
	next: NextFunction): Promise<void|Response<UpdateResponse>> => 
{
	if (req.sessionId !== req.body._id) {
		next(unathorizedError(ERR_MSG.unauthorized_operation))
	}
	return UserService.update(req.body)
		.then(() => res.status(StatusCodes.CREATED).send({ message: msg_update_completed }))
		.catch(next);
}