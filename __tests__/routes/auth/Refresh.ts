import { app } from "@/App";
import request from "supertest";
import * as db from "@test-util/MongoMemory";
import { ERR_MSG } from "@/shared/errors";
import { StatusCodes } from "http-status-codes";
import { checkSessionPackage } from "@test-util/checkers";
import * as TokenService from "@/services/TokenService";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("Calling POST /auth/refresh", () => {

	it("should return a new session package when provided active tokens ", 
	async () => {
		const tokens = TokenService.generate("refresh");
		const response = await request(app)
			.post("/auth/refresh")
			.send({
				auth: tokens.auth,
				refresh: tokens.refresh
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
		expect(response.body.message).toBe(ERR_MSG.session_invalid);
	});

});