import { getRequest, openSession } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { SessionPackage } from "@/interfaces";
import { LeanDocument } from "mongoose";
import { ERR_MSG } from "@/shared/errors";
import { Role, User, UserModel } from "@/models/User";
import { StatusCodes } from "http-status-codes";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/";

describe("Calling GET " + endpoint, () => {

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

	it("should receive the cared user when it exists", async () => {
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper,
			cared: patient
		});

		const response = await getRequest(endpoint + user._id + "/cared", session.auth)
			.send()
			.expect(StatusCodes.OK);

		const cared = response.body.cared;	
		expect(cared._id).toEqual((patient._id as unknown).toString());
		expect(cared.googleId).toEqual(patient.googleId);
		expect(cared.role).toEqual(patient.role);
	});

	it("should receive an OK response with null when there's no cared", async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper
		});

		const response = await getRequest(endpoint + user._id + "/cared", session.auth)
			.send()
			.expect(StatusCodes.OK);

		const cared = response.body.cared;	
		expect(cared).toBeNull();
	});

	it("should receive an error response when requested from an invalid id", async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper
		});

		const response = await getRequest(endpoint + "/invalid/cared", session.auth)
			.send()
			.expect(StatusCodes.UNAUTHORIZED);
		expect(response.body.message).toEqual(ERR_MSG.unauthorized_operation);
	});

});