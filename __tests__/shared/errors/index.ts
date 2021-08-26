import { Severity } from "@/shared/constants";
import { badRequestError } from "@/shared/errors"
import { StatusCodes } from "http-status-codes";

describe("The badRequestError", () => {

	it("should be a HttpError with BAD REQUEST properties", () => {
		const error = badRequestError("message");
		expect(error.name).toBe("HttpError");
		expect(error.status).toBe(StatusCodes.BAD_REQUEST);
		expect(error.severity).toBe(Severity.WARN);
	})

})