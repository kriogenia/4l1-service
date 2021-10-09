import { app } from "@/App";
import * as TaskService from "@/services/TaskService";
import { FeedEvent } from "@/sockets/feed";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";
import { TaskMinDto } from "@/models/dto";
import { TaskDto } from "@/models/dto/Message";
import { objectId } from "@/Mongo";
import { getFeedRoom } from "@/sockets/SocketHelper";

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
	return getFeedRoom(req.sessionId)
		.then((room) => {	// save the task
			return TaskService.create({
				title: data.title,
				description: data.description,
				submitter: objectId(data.submitter._id),
				username: data.submitter.displayName,
				done: data.done,
				timestamp: data.timestamp,
				room: room
			});
		})
		.then((task) => {	// share and return the task
			const response: TaskDto = task.dto();
			(app.get("io") as Server)?.to(task.room).emit(FeedEvent.NEW, response);
			return res.status(StatusCodes.CREATED).send(response);
		});
}
