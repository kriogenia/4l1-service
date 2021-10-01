import { app } from "@/App";
import * as UserService from "@/services/UserService";
import { MessageType, TaskMessage } from "@/models/Message";
import { Role } from "@/models/User";
import * as FeedService from "@/services/FeedService";
import { FEED, FeedEvent } from "@/sockets/feed";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";
import { badRequestError, ERR_MSG } from "@/shared/errors";
import { TaskMinDto } from "@/models/dto";
import { TaskDto } from "@/models/dto/Message";
import { objectId } from "@/Mongo";

/**
 * Returns the cared user of the requester, if it exists
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const newTask = async (
	req: Request<unknown, unknown, TaskMinDto>, 
	res: Response<TaskDto>, 
	_next: NextFunction): Promise<void|Response<TaskDto>> => 
{
	const data = req.body;
	return UserService.getById(req.sessionId)
		.then((user) => {	// retrieve user feed room
			if (user.role === Role.Blank) throw badRequestError(ERR_MSG.invalid_role);
			if (user.role === Role.Keeper && !user.cared) throw badRequestError(ERR_MSG.keeper_not_bonded);
			return `${FEED}:${(user.role === Role.Patient) ? req.sessionId : user.cared.toString()}`
		})
		.then((room) => {	// save the task
			return FeedService.create({
				title: data.title,
				submitter: objectId(data.submitter._id),
				username: data.submitter.displayName,
				done: data.done,
				timestamp: data.timestamp,
				type: MessageType.Task,
				room: room
			});
		})
		.then((task) => {	// share and return the task
			const response: TaskDto = (task as TaskMessage).dto();
			(app.get("io") as Server).to(task.room).emit(FeedEvent.NEW, response);
			return res.status(StatusCodes.OK).send(response);
		});
}
