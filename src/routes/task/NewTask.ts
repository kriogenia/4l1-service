import * as TaskService from "@/services/TaskService";
import { FeedEvent } from "@/sockets/feed";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TaskMinDto } from "@/models/dto";
import { TaskDto } from "@/models/dto/Message";
import { objectId } from "@/Mongo";
import { getFeedRoom } from "@/sockets/SocketHelper";
import { io } from "@server";

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
	const { submitter, ...data} = req.body;
	return getFeedRoom(req.sessionId)
		.then((room) => {	// save the task
			return TaskService.create({
				...data,
				submitter: objectId(submitter._id),
				username: submitter.displayName,
				room: room
			});
		})
		.then((task) => {	// share and return the task
			const response: TaskDto = task.dto();
			io.to(task.room).emit(FeedEvent.NEW, task);
			return res.status(StatusCodes.CREATED).send(response);
		});
}
