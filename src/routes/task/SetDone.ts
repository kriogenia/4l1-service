import { io } from "@/Server";
import * as TaskService from "@/services/TaskService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IdParam } from "@/shared/values";
import { getFeedRoom } from "@/sockets/SocketHelper";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { FEED } from "@/sockets/feed";
import * as NotificationService from "@/services/NotificationService";
import { Action } from "@/models/Notification";
import { GLOBAL } from "@/sockets/global";

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
	const userId = req.sessionId;
	let roomId: string;
	return getFeedRoom(userId)
		.then((room) => {
			roomId = room;
			if (!TaskService.belongsTo(id, room)) {
				throw unathorizedError(ERR_MSG.unauthorized_operation);
			}
			return TaskService.update({ _id: id, done: done });
		})
		.then(async (task) => {
			res.status(StatusCodes.NO_CONTENT).send();
			return NotificationService.create(done ? Action.TASK_DONE: Action.TASK_UNDONE, 
				userId, [ task.title, task._id ])
		})
		.then((notification) => {
			if (!notification) return;
			io.to(roomId.replace(FEED, GLOBAL)).emit(
				notification.event, notification.dto());
		})
		.catch(next);
}
