import { NextFunction, Request, Response } from "express";
import * as NotificationService from "@/services/NotificationService";
import { StatusCodes } from "http-status-codes";

interface SetNotificationReadParams {
	id: string
}

/**
 * Sets a notification as read
 * @param req request with the user credentials and notification id
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 */
export const setNotificationRead = async (
	req: Request<SetNotificationReadParams>, 
	res: Response, 
	next: NextFunction): Promise<void|Response> => 
{
	return NotificationService.setReadByUser(req.params.id, req.sessionId)
		.then(() => res.status(StatusCodes.NO_CONTENT).send())
		.catch(next);
}