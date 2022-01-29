import { Role, UserModel } from "@/models/User";
import * as db from "@test-util/MongoMemory";
import { openSession, deleteRequest } from "@test-util/SessionSetUp";
import { StatusCodes } from "http-status-codes";
import { SessionDto, UserDto } from "@/models/dto";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/bonds/";

describe("Calling DELETE " + endpoint, () => {

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

	it("should remove the bond if it's correct", async () => {
		const keeper = await UserModel.findById(user._id);
		keeper.role = Role.Keeper;
		await keeper.save();
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		await patient.bondWith(keeper);

		await deleteRequest(endpoint + patient._id, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);

		const storedPatient = await UserModel.findById(patient._id);
		expect(storedPatient.bonds.length).toBe(0);
		const storedKeeper = await UserModel.findById(user._id);
		expect(storedKeeper.cared).toBeUndefined();
	});

});