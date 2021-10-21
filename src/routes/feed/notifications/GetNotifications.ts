import { NextFunction, Request, Response } from "express";
import { NotificationDto } from "@/models/dto";
import * as NotificationService from "@/services/NotificationService";
import { StatusCodes } from "http-status-codes";

interface GetNotificationsQueryParams {
	maxDays?: number
}

interface GetNotificationshResponse {
	notifications: NotificationDto[]
}

/**
 * Returns the unread notifications of the user
 * @param req request with the user credentials
 * @param res carried response
 * @param next invokation of the next middleware to use in case of error
 * @returns the sending response with the list of notifications
 */
export const getNotifications = async (
	req: Request<unknown, unknown, unknown, GetNotificationsQueryParams>, 
	res: Response<GetNotificationshResponse>, 
	next: NextFunction): Promise<void|Response<GetNotificationshResponse>> => 
{
	return NotificationService.getUnread(req.sessionId, req.query.maxDays)
		.then((notifications) => res.status(StatusCodes.OK).send({
				notifications: notifications.map((n) => n.dto())
		}))
		.catch(next);
}