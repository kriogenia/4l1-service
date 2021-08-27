import { openSession, putRequest } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { SessionPackage } from "@/interfaces";
import { LeanDocument } from "mongoose";
import { Role, User, UserModel } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { msg_update_completed } from "@/shared/constants";
import { ERR_MSG } from "@/shared/errors";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/update/";

describe("Calling PUT /user/update", () => {

	let session: SessionPackage;
	let user: LeanDocument<User>;

	beforeEach((done) => {
		openSession((response) => {
			session = response.session;
			user = response.user;
			if (session && user) {
				done();
			}
		});
	});

	it("should update the user when given the proper user", async () => {
		const updatedUser = {
			...user,
			role: Role.Keeper,
			displayName: "Name",
			mainPhoneNumber: "123456789",
			altPhoneNumber: "987654321",
			email: "email@address.com"
		};

		const response = await putRequest(endpoint, session.auth)
			.send(updatedUser)
			.expect(StatusCodes.CREATED);
		expect(response.body.message).toEqual(msg_update_completed);

		const dbUser = await UserModel.findById(user._id);
		expect(dbUser.role).toEqual(updatedUser.role);
		expect(dbUser.displayName).toEqual(updatedUser.displayName);
		expect(dbUser.mainPhoneNumber).toEqual(updatedUser.mainPhoneNumber);
		expect(dbUser.altPhoneNumber).toEqual(updatedUser.altPhoneNumber);
		expect(dbUser.email).toEqual(updatedUser.email);
	});

	it("should return an error when the requester is not the user", async () => {
		const updatedUser = {
			_id: "not_the_same_id",
			role: Role.Keeper,
			displayName: "Name",
			mainPhoneNumber: "123456789",
			altPhoneNumber: "987654321",
			email: "email@address.com"
		};

		const response = await putRequest(endpoint, session.auth)
			.send(updatedUser)
			.expect(StatusCodes.UNAUTHORIZED);
		expect(response.body.message).toEqual(ERR_MSG.unauthorized_operation);
	});

});