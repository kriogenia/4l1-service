import * as TokenService from "@/services/TokenService";
import * as UserService from "@/services/UserService";
import * as NotificationService from "@/services/NotificationService";
import { BasicResponse } from "@/shared/values";
import { msg_bonding_completed } from "@/shared/strings";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Action } from "@/models/Notification";
import { io } from "@server";
import { GLOBAL } from "@/sockets/global";

interface EstablishBondBody {
	code: string
}

/**
 * Validates a bonding token and create the bond if it's valid
 * @param req request with the bonding token
 * @param res carried response
 * @returns response with the success or error message
 */
export const establish = async (
	req: Request<unknown, unknown, EstablishBondBody>, 
	res: Response<BasicResponse>,
	next: NextFunction): Promise<void|Response<BasicResponse>> => 
{
	const keeperId = req.sessionId;
	let patientId: string;
	return TokenService.decodeBond(req.body.code)
		.then((id) =>{ 
			patientId = id;
			return UserService.bond(id, keeperId);
		})
		.then(() => {
			res.status(StatusCodes.OK).send({ message: msg_bonding_completed });
			return NotificationService.create(Action.BOND_CREATED, keeperId);
		})
		.then((notification) => {
			io.to(`${GLOBAL}:${patientId}`).emit(notification.event, notification.dto())
		} )
		.catch(next);
}