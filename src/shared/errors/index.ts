import { StatusCodes } from "http-status-codes";
import { Severity } from "../enums";
import { HttpError } from "./HttpError";

export * as ERR_MSG from "./messages";
export { HttpError } from "./HttpError";

/**
 * @param message of the error
 * @returns new HttpError with status 400: Bad request
 */
export const badRequestError = (message?: string): HttpError => {
	return new HttpError({
		status: StatusCodes.BAD_REQUEST,
		severity: Severity.WARN,
		message: message
	});
}

/**
 * @param message of the error
 * @returns new HttpError with status 401: Bad request
 */
export const unathorizedError = (message?: string): HttpError => {
	return new HttpError({
		status: StatusCodes.UNAUTHORIZED,
		severity: Severity.WARN,
		message: message
	});
}