import { User } from "@/models/User";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LeanDocument } from "mongoose";
import * as UserService from "@/services/UserService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { msg_update_completed } from "@/shared/constants";
import { BasicResponse } from "@/interfaces";

/**
 * Updates the stored information of the current user with provided new info
 * @param req request with the new information and user identification
 * @param res carried response 
 * @param next invokation of the next middleware to use in case of error
 * @returns the sendind response with the success or error confirmation message
 */
export const update = async (
	req: Request<unknown, unknown, LeanDocument<User>>, 
	res: Response<BasicResponse>, 
	next: NextFunction): Promise<void|Response<BasicResponse>> => 
{
	if (req.sessionId !== req.body._id) {
		next(unathorizedError(ERR_MSG.unauthorized_operation))
	}
	return UserService.update(req.body)
		.then(() => res.status(StatusCodes.CREATED).send({ message: msg_update_completed }))
		.catch(next);
}