import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as UserService from "@/services/UserService";
import { UserDto } from "@/models/dto";
import { IdParam } from "@/shared/values";
import * as NotificationService from "@/services/NotificationService";
import { Action } from "@/models/Notification";
import { Role } from "@/models/User";
import { GLOBAL } from "@/sockets/global";
import { io } from "@server";

/**
 * Removes the bond of the user with the specified user
 * @param req request with the bond id
 * @param res carried response 
 * @param next invokation of the next middleware to use in case of error
 * @returns the response with the success or error confirmation message
 */
export const removeBond = async (
	req: Request<IdParam>, 
	res: Response, 
	next: NextFunction): Promise<void|Response<UserDto>> => 
{
	let patientId: string;
	return UserService.getRole(req.sessionId)
		.then((role) => {
			patientId = role === Role.Patient ? req.sessionId : req.params.id;
			return UserService.unbond(req.sessionId, req.params.id);
		})
		.then(() => {
			res.status(StatusCodes.NO_CONTENT).send();
			return NotificationService.create(Action.BOND_DELETED, patientId);
		})
		.then((notification) => {
			io.to(`${GLOBAL}:${patientId}`).emit(notification.event, notification.dto())
		})
		.catch(next);
}