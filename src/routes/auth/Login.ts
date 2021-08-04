import { Request, Response } from "express";

export const login = (_req: Request, res: Response): Response => {
	return res.status(200).send("Auth");
}