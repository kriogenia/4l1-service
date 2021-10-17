import { NextFunction, Request, Response } from "express";
import * as FeedService from "@/services/FeedService";
import { LeanDocument } from "mongoose";
import { Message } from "@/models/Message";
import { StatusCodes } from "http-status-codes";
import { getFeedRoom } from "@/sockets/SocketHelper";

interface GetBatchQueryParams {
	page?: number
}

interface GetBatchResponse {
	messages: LeanDocument<Message>[]
}

/**
 * Returns the requested batch of messages of the specified chat
 * The default size of any batch is 25.
 * @param req request with the user credentials and page position
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns the sending response with the list of messages.
 */
export const getBatch = async (
	req: Request<unknown, unknown, unknown, GetBatchQueryParams>, 
	res: Response<GetBatchResponse>, 
	next: NextFunction): Promise<void|Response<GetBatchResponse>> => 
{
	return getFeedRoom(req.sessionId)
		.then((room) => FeedService.getBatch(room, req.query.page))
		.then((messages) => {
			return res.status(StatusCodes.OK).send({
				messages: messages
			}).send();
		})
		.catch(next);
}