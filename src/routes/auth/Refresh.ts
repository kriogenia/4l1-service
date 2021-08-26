import { SessionPackage } from "@/interfaces";
import * as TokenService from "@/services/TokenService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface RefreshBody {
	auth: string,
	refresh: string
}

interface RefreshResponse {
	session: SessionPackage
}

export const refresh = async (
	req: Request<unknown, unknown, RefreshBody>, 
	res: Response<RefreshResponse>, 
	next: NextFunction): Promise<void|Response<RefreshResponse>> => 
{
	const { auth, refresh } = req.body;
	return TokenService
		.checkTuple(auth, refresh)				// Checks that the session is valid
		.then((isValid) => {
			if (isValid) return TokenService.refresh(auth, refresh); // If it is refresh it
			throw unathorizedError(ERR_MSG.session_invalid);
		})
		.then((pack) => res.status(StatusCodes.OK).json({ session: pack }).send()) // and send it
		.catch(next);
}