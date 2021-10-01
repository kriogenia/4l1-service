import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as UserService from "@/services/UserService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { UserDto, UserPublicDto } from "@/models/dto";

interface UpdateParams {
	id: string
}
/**
 * Updates the stored information of the current user with provided new info
 * @param req request with the new information and user identification
 * @param res carried response 
 * @param next invokation of the next middleware to use in case of error
 * @returns the sendind response with the success or error confirmation message
 */
export const update = async (
	req: Request<UpdateParams, unknown, UserPublicDto>, 
	res: Response<UserDto>, 
	next: NextFunction): Promise<void|Response<UserDto>> => 
{
	if (req.sessionId !== req.params.id) {
		return next(unathorizedError(ERR_MSG.unauthorized_operation));
	}

	return UserService.update({ _id: req.params.id, ...req.body})
		.then((user) => res.status(StatusCodes.CREATED).send(user.dto()))
		.catch(next);
}