import { handleError, validateToken } from "@/routes/middlewares";
import { checkAuth, extractId } from "@/services/TokenService";
import { errorHandler } from "@/shared/ErrorHandler";
import { badRequestError, ERR_MSG, HttpError } from "@/shared/errors";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { mocked } from "ts-jest/utils";

jest.mock("@/services/TokenService.ts");
jest.mock("@/shared/ErrorHandler.ts");

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction;

beforeEach(() => {
	mockRequest = {};
	mockResponse = {
		setHeader: jest.fn((_key: string, _value: string) =>  mockResponse as Response),
		status: jest.fn((_code: number) => mockResponse as Response),
		json: jest.fn((_body: any) => mockResponse as Response),
		send: jest.fn()
	};
	nextFunction = jest.fn()
});

describe("The token validation middleware", () => {
	
	const mockCheckAuth = mocked(checkAuth, true);
	mockCheckAuth.mockImplementation((token: string) => {
		return Promise.resolve(token === "valid");
	});
		
	const mockExtractId = mocked(extractId, true);
	mockExtractId.mockImplementation((token: string) => {
		return token.substring(0, 1);
	});

	it("should call to the next function and set header and sessionId " + 
	"with a valid authorization header", async () => {
		mockRequest.headers = {
			authorization: "Bearer valid"
		};

		expect.assertions(4);
		return validateToken(mockRequest as Request, mockResponse as Response, nextFunction)
			.then(() => {
				expect(mockCheckAuth).toBeCalledTimes(1);
				expect(mockResponse.setHeader).toBeCalledWith("Authorization", "Bearer valid");
				expect(mockRequest.sessionId).toBe("v");
				expect(nextFunction).toBeCalledTimes(1);
			});
	
	});

	it("should throw an error if the header is missing the Bearer", async () => {
		mockRequest.headers = {
			authorization: "invalid"
		};

		expect.assertions(2);
		return validateToken(mockRequest as Request, mockResponse as Response, nextFunction)
			.catch((e: HttpError) => {
				expect(e.status).toEqual(StatusCodes.BAD_REQUEST);
				expect(e.message).toEqual(ERR_MSG.auth_header);
			});
	});

	it("should throw an error if Bearer is misspelled", async () => {
		mockRequest.headers = {
			authorization: "invalid token"
		};

		expect.assertions(2);
		return validateToken(mockRequest as Request, mockResponse as Response, nextFunction)
			.catch((e: HttpError) => {
				expect(e.status).toEqual(StatusCodes.BAD_REQUEST);
				expect(e.message).toEqual(ERR_MSG.auth_header);
			});
	});

	it("should throw an error if the token is invalid", async () => {
		mockRequest.headers = {
			authorization: "Bearer invalid"
		};

		expect.assertions(2);
		return validateToken(mockRequest as Request, mockResponse as Response, nextFunction)
			.catch((e: HttpError) => {
				expect(e.status).toEqual(StatusCodes.UNAUTHORIZED);
				expect(e.message).toEqual(ERR_MSG.session_invalid);
			});
	});

});

describe("The handle error middleware", () => {
	
	const mockErrorHandler = mocked(errorHandler, true);

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