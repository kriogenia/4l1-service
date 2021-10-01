import { openSession, patchRequest } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { Role, UserModel } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { ERR_MSG } from "@/shared/errors";
import { SessionDto, UserDto } from "@/models/dto";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/";

describe("Calling PUT " + endpoint, () => {

	let session: SessionDto;
	let user: UserDto;

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
			email: "email@address.com",
			address: {
				firstLine: "first",
				secondLine: "second",
				locality: "locality",
				region: "region"
			}
		};

		const { body } = await patchRequest(endpoint + user._id, session.auth)
			.send(updatedUser)
			.expect(StatusCodes.CREATED);

		expect(body.role).toEqual(updatedUser.role);
		expect(body.displayName).toEqual(updatedUser.displayName);
		expect(body.mainPhoneNumber).toEqual(updatedUser.mainPhoneNumber);
		expect(body.altPhoneNumber).toEqual(updatedUser.altPhoneNumber);
		expect(body.email).toEqual(updatedUser.email);
		expect(body.address).toEqual(updatedUser.address);

		const dbUser = await UserModel.findById(user._id);
		expect(dbUser.role).toEqual(updatedUser.role);
		expect(dbUser.displayName).toEqual(updatedUser.displayName);
		expect(dbUser.mainPhoneNumber).toEqual(updatedUser.mainPhoneNumber);
		expect(dbUser.altPhoneNumber).toEqual(updatedUser.altPhoneNumber);
		expect(dbUser.email).toEqual(updatedUser.email);
		expect(dbUser.address).toEqual(updatedUser.address);
	});

	it("should return an error when the requester is not the user", async () => {
		const updatedUser = {
			role: Role.Keeper,
			displayName: "Name",
			mainPhoneNumber: "123456789",
			altPhoneNumber: "987654321",
			email: "email@address.com"
		};

		const response = await patchRequest(endpoint + "not_the_same_id", session.auth)
			.send(updatedUser)
			.expect(StatusCodes.UNAUTHORIZED);
		expect(response.body.message).toEqual(ERR_MSG.unauthorized_operation);
	});

});