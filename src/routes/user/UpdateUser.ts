import { User } from "@/models/User";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as UserService from "@/services/UserService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { msg_update_completed } from "@/shared/strings";
import { BasicResponse } from "@/interfaces";

interface UpdateParams {
	id: string
}

type UpdateBody = Partial<User>;

/**
 * Updates the stored information of the current user with provided new info
 * @param req request with the new information and user identification
 * @param res carried response 
 * @param next invokation of the next middleware to use in case of error
 * @returns the sendind response with the success or error confirmation message
 */
export const update = async (
	req: Request<UpdateParams, unknown, UpdateBody>, 
	res: Response<BasicResponse>, 
	next: NextFunction): Promise<void|Response<BasicResponse>> => 
{
	if (req.sessionId !== req.params.id) {
		return next(unathorizedError(ERR_MSG.unauthorized_operation));
	}

	const data = req.body;
	data._id = req.params.id;
	return UserService.update(data)
		.then(() => res.status(StatusCodes.CREATED).send({ message: msg_update_completed }))
		.catch(next);
}