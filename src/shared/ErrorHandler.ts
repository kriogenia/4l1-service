import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Severity } from "./constants";
import { HttpError } from "./errors";
import { LOG } from "./Logger";

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

class ErrorHandler {

	private logMap = new Map([
        [Severity.INFO, (content: any) => LOG.info(content)],
        [Severity.IMP, (content: any) => LOG.imp(content)],
        [Severity.WARN, (content: any) => LOG.warn(content)],
        [Severity.ERR, (content: any) => LOG.err(content)]
    ]);

	/**
	 * Handles the error, logging it based on the type of error
	 * @param error to handle, can be an HttpError or unknown error
	 */
	handleError = (error: Error): void => {
        if (this.isTrustedError(error)) {
            this.logMap.get(error.severity)?.call(this, error);
        } else {
			LOG.err(error, true);
		}
    }

	/**
	 * @param error 
	 * @returns true if the error is operational, false otherwise
	 */
	isTrustedError = (error: Error) : error is HttpError =>  {
		return (error instanceof HttpError);
	};

}

export const errorHandler = new ErrorHandler();