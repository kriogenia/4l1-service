import * as TokenService from "@/services/TokenService";
import * as UserService from "@/services/UserService";
import { BasicResponse } from "@/shared/values";
import { msg_bonding_completed } from "@/shared/strings";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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
	return TokenService.decodeBond(req.body.code)
		.then((patientId) => UserService.bond(patientId, keeperId))
		.then(() => res.status(StatusCodes.OK).send({ 
			message: msg_bonding_completed
		}))	// TODO send new bonding creation message
		.catch(next);
}