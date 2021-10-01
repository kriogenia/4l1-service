import { SessionPackage } from "@/interfaces";
import { Role, User, UserContact, UserModel } from "@/models/User";
import { ERR_MSG } from "@/shared/errors";
import * as db from "@test-util/MongoMemory";
import { getRequest, openSession } from "@test-util/SessionSetUp";
import { StatusCodes } from "http-status-codes";
import { LeanDocument } from "mongoose";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/bonds";

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

	it("should retrieve the bonds of Patients", async () => {
		const keeper = await UserModel.create({
			googleId: "keeper1",
			role: Role.Keeper,
			displayName: "name"
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient,
			bonds: [ keeper._id ]
		});

		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const bonds = response.body.bonds as UserContact[];
		expect(bonds.length).toBe(1);
		expect(bonds[0]).toMatchObject({
			role: keeper.role,
			displayName: keeper.displayName
		});
	});

	it("should retrieve the bonds of Keepers' cared", async () => {
		const otherKeeper = await UserModel.create({
			googleId: "keeper",
			role: Role.Keeper,
			displayName: "name"
		});
		const patient = await UserModel.create({
			googleId: "keeper1",
			role: Role.Patient,
			bonds: [ otherKeeper._id, user._id ]
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper,
			cared: patient._id
		});

		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const bonds = response.body.bonds as UserContact[];
		expect(bonds.length).toBe(1);
		expect(bonds[0]).toMatchObject({
			role: otherKeeper.role,
			displayName: otherKeeper.displayName
		});
	});

	it("should throw an error message when requested by Blank users", async () => {
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.BAD_REQUEST);

		expect(response.body.message).toEqual(ERR_MSG.unauthorized_operation);
	});

});