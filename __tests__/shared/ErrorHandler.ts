import { Severity } from "@/shared/constants";
import { errorHandler } from "@/shared/ErrorHandler";
import { HttpError } from "@/shared/errors";
import { LOG } from "@/shared/Logger";

jest.mock("@/shared/Logger");

describe("The ErrorHandler", () => {

	/* eslint-disable @typescript-eslint/unbound-method */
    it("should log the errors with the correct log operation", () => {
        const errors = [
            new HttpError({name: "", status: 1, severity: Severity.INFO, message: "info"}),
            new HttpError({name: "", status: 1, severity: Severity.IMP, message: "imp"}),
            new HttpError({name: "", status: 1, severity: Severity.WARN, message: "warn"}),
            new HttpError({name: "", status: 1, severity: Severity.ERR, message: "err"}),
            new Error("err")
        ];
        errors.forEach((e: Error) => errorHandler.handleError(e));
        expect(LOG.info).toHaveBeenCalledTimes(1);
        expect(LOG.imp).toHaveBeenCalledTimes(1);
        expect(LOG.warn).toHaveBeenCalledTimes(1);
        expect(LOG.err).toHaveBeenCalledTimes(2);
    });

    it("should discern the type of error", () => {
        const knownEror = new HttpError({name: "", status: 1, severity: Severity.INFO, message: "known"});
        expect(errorHandler.isTrustedError(knownEror)).toBeTruthy;
		const unknownError = new Error("unknown");
		expect(errorHandler.isTrustedError(unknownError)).toBeFalsy;
    });

});