import { Severity } from "@/shared/entities";
import { HttpError } from "@/shared/errors";
import { StatusCodes } from "http-status-codes";

describe("The HttpError", () => {

	describe("should construct", () => {

		it("with the highest severity when no options is provided", () => {
			const error = new HttpError({});
			expect(error.name).toBe("HttpError");
			expect(error.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(error.severity).toBe(Severity.ERR);
			expect(error.message).toBe("");
		});

		it("with the provided options", () => {
			const error = new HttpError({
				name: "name",
				status: StatusCodes.BAD_REQUEST,
				severity: Severity.WARN,
				message: "message"
			});
			expect(error.name).toBe("name");
			expect(error.status).toBe(StatusCodes.BAD_REQUEST);
			expect(error.severity).toBe(Severity.WARN);
			expect(error.message).toBe("message");
		});

	});

	it("should build correctly its JSON", () => {
		const error = new HttpError({ message: "message"});
		expect(error.toJson()).toEqual({ message: "message"});
	});

})