import { app } from "@/App";
import request from "supertest";
import * as db from "@test-util/MongoMemory";
import * as UserService from "@/services/UserService";
import { mocked } from "ts-jest/utils";
import { verify } from "@/services/GoogleAuth";
import { StatusCodes } from "http-status-codes";
import { checkSessionPackage } from "@test-util/checkers";
import { Role } from "@/models/User";

/* Mock GoogleAuth */
jest.mock("@/services/GoogleAuth");
const mockVerify = mocked(verify);
mockVerify.mockImplementation((token) => Promise.resolve(token));

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("Calling GET /auth/signin", () => {

	it("should return a new user and session when given an unregistered Google Id", 
	async () => {
		const token = "valid";
		const response = await request(app)
			.get(`/auth/signin/${token}`)
			.send()
			.expect(StatusCodes.OK);

		checkSessionPackage(response.body.session);
		expect(response.body.user._id).not.toHaveLength(0);
		expect(response.body.user.googleId).toBe(token);
		expect(response.body.user.role).toBe(Role.Blank)
	});
	
	it("should return the user and a new session when given an registered Google Id", 
	async () => {
		const token = "existent";
		const user = await UserService.getUserByGoogleId(token);

		const response = await request(app)
			.get(`/auth/signin/${token}`)
			.send()
			.expect(StatusCodes.OK);

		checkSessionPackage(response.body.session);
		expect(response.body.user.id).toEqual(user.toJSON().id);
		expect(response.body.user.googleId).toBe(user.googleId);
		expect(response.body.user.role).toBe(user.role);
	});

	it("should return an error when requested without token", 
	async () => {
		await request(app)
			.get(`/auth/signin/`)
			.send()
			.expect(StatusCodes.NOT_FOUND);
	});

});