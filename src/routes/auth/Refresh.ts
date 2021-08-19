import { SessionPackage } from "@/interfaces";
import * as TokenService from "@/services/TokenService";
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
	return TokenService.refresh(auth, refresh)
		.then((pack) => res.status(StatusCodes.OK).json({ session: pack }).send())
		.catch(next);
}