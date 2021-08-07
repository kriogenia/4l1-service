import { StatusCodes } from "http-status-codes";
import { Severity } from "../constants";
import { HttpError } from "./HttpError";

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