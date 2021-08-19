import { app } from "@/App";
import request from "supertest";
import * as jwt from "jsonwebtoken";
import { ERR_MSG } from "@/shared/errors";
import { StatusCodes } from "http-status-codes";
import { checkSessionPackage } from "@test-util/checkers";

describe("Calling POST /auth/refresh", () => {

	it("should return a new session package when provided valid tokens ", 
	async () => {
		const authToken = jwt.sign(
			{ sessionId : "id" }, 
			process.env.AUTH_TOKEN_SECRET, 
			{ expiresIn: process.env.AUTH_TOKEN_EXPIRATION_TIME }
		);
		const refreshToken = jwt.sign(
			{ sessionId : "id" }, 
			process.env.REFRESH_TOKEN_SECRET, 
			{ expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME }
		);

		const response = await request(app)
			.post("/auth/refresh")
			.send({
				auth: authToken,
				refresh: refreshToken
			})
			.expect(StatusCodes.OK);
		checkSessionPackage(response.body.session);
	});

	it("should return a new error response when provided invalid tokens", 
	async () => {
		const response = await request(app)
			.post("/auth/refresh")
			.send({
				auth: "authToken",
				refresh: "refreshToken"
			})
			.expect(StatusCodes.UNAUTHORIZED);
		expect(response.body.message).toBe(ERR_MSG.token_invalid);
	});

});