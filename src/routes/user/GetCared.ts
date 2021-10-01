import { UserDto } from "@/models/dto";
import * as UserService from "@/services/UserService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface GetCaredParams {
	id: string
}

interface GetCaredResponse {
	cared: UserDto
}

/**
 * Returns the cared user of the requester, if it exists
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const cared = async (
	req: Request<GetCaredParams>, 
	res: Response<GetCaredResponse>, 
	next: NextFunction): Promise<void|Response<GetCaredResponse>> => 
{
	if (req.sessionId !== req.params.id) {
		return next(unathorizedError(ERR_MSG.unauthorized_operation));
	}

	return UserService.getCared(req.sessionId)
		.then((result) => res.status(StatusCodes.OK).send({ cared: result?.dto()}))
		.catch(next);
}