import * as TaskService from "@/services/TaskService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IdParam } from "@/shared/values";

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
	return TaskService.update({ _id: req.params.id, done: done })
		.then(() => res.status(StatusCodes.OK).send())
		.catch(next);
}
