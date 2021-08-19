import { app } from "@/App";
import { SessionPackage } from "@/interfaces";
import request from "supertest";
import * as jwt from "jsonwebtoken";
import { ERR_MSG } from "@/shared/errors";
import { StatusCodes } from "http-status-codes";

describe("Calling POST /auth/refresh", () => {

	it("with valid tokens should return a new session package", 
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
		const session: SessionPackage = response.body.session;
		expect(session.auth).not.toBeNull();
		expect(session.refresh).not.toBeNull();
		expect(session.expiration).not.toBeNull();
	});

	it("with invalid tokens should return a new error response", 
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