import { handleError } from "@/routes/middlewares";
import { errorHandler } from "@/shared/ErrorHandler";
import { HttpError } from "@/shared/errors";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { mocked } from "ts-jest/utils";

jest.mock("@/shared/ErrorHandler.ts");
const mockErrorHandler = mocked(errorHandler, true);

describe("The handle error middleware", () => {
	
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const nextFunction: NextFunction = jest.fn();

	beforeEach(() => {
        mockRequest = {};
        mockResponse = {
			status: jest.fn((_code: number) => mockResponse as Response),
            json: jest.fn((_body: any) => mockResponse as Response),
			send: jest.fn()
        };
    });

	it("should handle known errors and send the related response", () => {
		const error = new HttpError({ message: "test" });
		mockErrorHandler.isTrustedError.mockReturnValue(true);
		handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
		expect(errorHandler.handleError).toBeCalledWith(error);
		expect(mockResponse.status).toBeCalledWith(error.status);
		expect(mockResponse.json).toBeCalledWith(error.toJson());
		expect(mockResponse.send).toBeCalledTimes(1);
		expect(nextFunction).toBeCalledTimes(1);
	});

	it("should handle unknown errors and send an internal error response", () => {
		const error = new Error("test");
		mockErrorHandler.isTrustedError.mockReturnValue(false);
		handleError(error, mockRequest as Request, mockResponse as Response, nextFunction);
		expect(errorHandler.handleError).toBeCalledWith(error);
		expect(mockResponse.status).toBeCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(mockResponse.json).toBeCalledWith({
            message: "An unexpected error has occurred"
        });
		expect(mockResponse.send).toBeCalledTimes(1);
		expect(nextFunction).toBeCalledWith(error);
	});

});