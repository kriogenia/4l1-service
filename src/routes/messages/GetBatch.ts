import { NextFunction, Request, Response } from "express";
import * as UserService from "@/services/UserService";
import * as FeedService from "@/services/FeedService";
import { Role } from "@/models/User";
import { LeanDocument } from "mongoose";
import { Message } from "@/models/Message";
import { badRequestError, ERR_MSG } from "@/shared/errors";
import { FEED } from "@/sockets/feed";
import { StatusCodes } from "http-status-codes";

interface GetBatchParams {
	token: string
}

interface GetBatchResponse {
	messages: LeanDocument<Message>[]
}

/**
 * Returns the requested batch of messages of the specified chat
 * The default size of any batch is 30.
 * @param req request with the Google credentials
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns the sending response with the list of messages.
 */
export const getBatch = async (
	req: Request<GetBatchParams>, 
	res: Response<GetBatchResponse>, 
	next: NextFunction): Promise<void|Response<GetBatchResponse>> => 
{
	return UserService.getById(req.sessionId)
		.then((user) => {
			if (user.role === Role.Blank) throw badRequestError(ERR_MSG.invalid_role);
			return `${FEED}:${(user.role === Role.Patient) ? req.sessionId : user.cared.toString()}`
		})
		.then((room) => FeedService.getBatch(room))
		.then((messages) => {
			return res.status(StatusCodes.OK).send({
				messages: messages
			}).send();
		})
		.catch(next);
}