import { errorHandler } from "@/shared/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Handles the errors associated to a request and response
 * @param err error to handle
 * @param _req original request
 * @param res carried response
 * @param _next next function
 * @returns error response to return to the user
 */
 export const handleError = (err: Error, _req: Request, res: Response, next: NextFunction) : void => {
	errorHandler.handleError(err);
    if (errorHandler.isTrustedError(err)) {
        res.status(err.status).json(err.toJson()).send();
		next();
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error has occurred"
        }).send();
		next(err);
    }
}