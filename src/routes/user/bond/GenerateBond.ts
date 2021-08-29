import * as TokenService from "@/services/TokenService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface GenerateBondResponse {
	code: string
}

/**
 * Generates a new bonding token for the user requesting it
 * @param req request with user id
 * @param res carried response
 * @returns response with the bonding token
 */
export const generate = (
	req: Request, 
	res: Response<GenerateBondResponse>): Response<GenerateBondResponse> => 
{
	return res.status(StatusCodes.OK).send({ code: TokenService.bond(req.sessionId)});
}