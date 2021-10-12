import { NextFunction, Request, Response } from "express";
import { TaskDto } from "@/models/dto";
import { StatusCodes } from "http-status-codes";
import * as TaskService from "@/services/TaskService";
import { getFeedRoom } from "@/sockets/SocketHelper";

interface GetTasksQueryParams {
	maxDays?: number
}

interface GetTasksResponse {
	tasks: TaskDto[]
}

/**
 * Returns the list of recent tasks of an user.
 * Those are all the not completed tasks and the completed tasks
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const getTasks = async (
	req: Request<unknown, unknown, unknown, GetTasksQueryParams>,
	res: Response<GetTasksResponse>, 
	next: NextFunction): Promise<void|Response<GetTasksResponse>> => 
{
	return getFeedRoom(req.sessionId)
		.then((room) => TaskService.getRelevant(room, req.query.maxDays))
		.then((tasks) => {
			return res.status(StatusCodes.OK).send({ 
				tasks: tasks.map((task) => task.dto())
			});
		})
		.catch(next);
	
}