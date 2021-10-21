import { NextFunction, Request, Response } from "express";
import * as NotificationService from "@/services/NotificationService";
import { StatusCodes } from "http-status-codes";

/**
 * Sets all the notifications of an user as red
 * @param req request with the user credentials
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 */
export const setNotificationRead = async (
	req: Request,
	res: Response,
	next: NextFunction): Promise<void|Response> =>
{
	return NotificationService.setAllRead(req.sessionId)
		.then(() => res.status(StatusCodes.NO_CONTENT).send())
		.catch(next);
}