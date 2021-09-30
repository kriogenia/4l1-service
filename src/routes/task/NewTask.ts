import { MessageType } from "@/models/Message";
import { create, getBatch } from "@/services/FeedService";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface NewTaskResponse {
	message: string
}

/**
 * Returns the cared user of the requester, if it exists
 * @param req request with the requester id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns data of the cared user or null
 */
export const newTask = async (
	_req: Request, 
	res: Response<NewTaskResponse>, 
	_next: NextFunction): Promise<void|Response<NewTaskResponse>> => 
{
	/*await create({
		message: "task",
		submitter: "61198ff240cec3067a66c0b1",
		username: "usnerma",
		timestamp: 1,
		type: MessageType.Task,
		room: "a"
	})*/
	console.log("on new");
	return res.status(StatusCodes.OK).send({message: (await getBatch("a")).toString()});
}