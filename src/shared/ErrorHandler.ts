import { Severity } from "./constants";
import { HttpError } from "./errors";
import { LOG } from "./Logger";

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
            this.logMap.get(error.severity).call(this, error);
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