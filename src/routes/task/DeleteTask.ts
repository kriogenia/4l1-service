import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as TaskService from "@/services/TaskService";
import { IdParam } from "@/shared/values";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { FeedEvent } from "@/sockets/feed";
import { getFeedRoom } from "@/sockets/SocketHelper";
import { io } from "@server";

/**
 * Removes the requested task
 * @param req request with the requester id and requested task id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 */
export const deleteTask = async (
	req: Request<IdParam>,
	res: Response, 
	next: NextFunction): Promise<void|Response> => 
{
	const { id } = req.params;
	return getFeedRoom(req.sessionId)
		.then((room) => {
			if (!TaskService.belongsTo(id, room)) {
				throw unathorizedError(ERR_MSG.unauthorized_operation);
			}
			return [room, TaskService.remove(id)];
		}).then(async ([room, task]) => {
			res.status(StatusCodes.NO_CONTENT).send();
			io.to(room as string).emit(FeedEvent.DELETE, await task);
		})
		.catch(next);
}