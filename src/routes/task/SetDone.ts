import * as TaskService from "@/services/TaskService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IdParam } from "@/shared/values";
import { getFeedRoom } from "@/sockets/SocketHelper";
import { ERR_MSG, unathorizedError } from "@/shared/errors";

/**
 * Updates the done state of a given task
 * @param done true to set is done, false otherwise
 * 
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const setDone = (done: boolean) => async (
	req: Request<IdParam>, 
	res: Response, 
	next: NextFunction): Promise<void|Response> => 
{
	const { id } = req.params;
	return getFeedRoom(req.sessionId)
		.then((room) => TaskService.belongsTo(id, room))
		.then((canEdit) => {
			if (!canEdit) throw unathorizedError(ERR_MSG.unauthorized_operation);
			return TaskService.update({ _id: id, done: done });
		})
		.then(() => res.status(StatusCodes.NO_CONTENT).send())
		.catch(next);
}
