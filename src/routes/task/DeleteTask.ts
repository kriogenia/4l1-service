import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as TaskService from "@/services/TaskService";
import { IdParam } from "@/shared/values";

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
	return TaskService.remove(req.params.id)
		.then(() => res.status(StatusCodes.NO_CONTENT).send())
		.catch(next);
	
}