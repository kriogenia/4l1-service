import { Role, User, UserModel } from "@/models/User";
import { bond, getByGoogleId, update } from "@/services/UserService";
import { badRequestError, ERR_MSG } from "@/shared/errors";
import * as db from "@test-util/MongoMemory";
import { mongoose } from "@typegoose/typegoose";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("The bond function", () => {

	let patient: User;
	let keeper: User;

	beforeEach(async () => {
		patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		keeper = await UserModel.create({
			googleId: "keeper",
			role: Role.Keeper
		});
	});

	it("should create the bond when everything is correct", async () => {
		await bond(patient._id, keeper._id);

		const storedPatient = await UserModel.findById(patient._id);
		expect(storedPatient.bonds.length).toBe(1);
		expect(storedPatient.bonds[0]).toEqual(keeper._id);
		const storedKeeper = await UserModel.findById(keeper._id);
		expect(storedKeeper.kept).toEqual(patient._id);
	});	

	it("should throw an error when the user roles are wrong", async () => {
		const blank = await UserModel.create({
			googleId: "keeper",
			role: Role.Blank
		});

		const message = "Invalid bond. The correct bond is PATIENT bonds with KEEPER";
		expect.assertions(5);
		await bond(keeper._id, patient._id).catch(e => { expect(e).toEqual(Error(message))});
		await bond(keeper._id, blank._id).catch(e => { expect(e).toEqual(Error(message))});
		await bond(blank._id, keeper._id).catch(e => { expect(e).toEqual(Error(message))});
		await bond(blank._id, patient._id).catch(e => { expect(e).toEqual(Error(message))});
		await bond(patient._id, blank._id).catch(e => { expect(e).toEqual(Error(message))});
		await bond(patient._id, keeper._id).catch(e => { expect(e).toEqual(Error(message))});
	});

	it("should throw an error when the patient has the max number of bonds", async () => {
		for (let i = 0; i < parseInt(process.env.MAX_BONDS); i++) {
			patient.bonds.push(new mongoose.Types.ObjectId());
		}
		await patient.save();

		expect.assertions(1);
		return bond(patient._id, keeper._id).catch(e => { 
			expect(e).toEqual(badRequestError(ERR_MSG.maximum_bonds_reached))
		});
	});

	it("should throw an error when the keeper is already kept", async () => {
		keeper.kept = patient._id;
		await keeper.save();

		expect.assertions(1);
		return bond(patient._id, keeper._id).catch(e => { 
			expect(e).toEqual(badRequestError(ERR_MSG.keeper_already_bonded))
		});
	});

});

describe("The function getUserByGoogleId", () => {

	it ("should generate a new user when no matching user exists", (done) => {
		const googleId = "googleId";
		getByGoogleId(googleId)
			.then((user) => {
				expect(user.id).not.toBeNull();
				expect(user.displayName).toBeUndefined();
				expect(user.googleId).toBe(googleId);
				expect(user.role).toBe(Role.Blank);
				done();
			})
			.catch(done);
	});
	
	it ("should return the matching user", async () => {
		const googleId = "googleId";
		// create the user
		const expected = await UserModel.create({
			googleId: googleId,
			role: Role.Keeper
		});
		return getByGoogleId(googleId)
			.then((user) => {
				expect(user.id).toEqual(expected.id);
				expect(user.displayName).toBe(expected.displayName);
				expect(user.googleId).toBe(expected.googleId);
				expect(user.role).toBe(expected.role);
			});
	});

});

describe("The update", () => {

	it("should update the user with the next data", async () => {
		const googleId = "googleId";
		const user = await UserModel.create({
			googleId: googleId,
			role: Role.Keeper
		});
		
		user.role = Role.Patient,
		user.displayName = "name",
		user.mainPhoneNumber = "main",
		user.altPhoneNumber = "alt",
		user.email = "email";
		user.address = {
			firstLine: "first",
			secondLine: "second",
			locality: "locality",
			region: "region"
		}

		await update(user);
		const dbUser = await UserModel.findById(user._id);

		expect(dbUser.role).toEqual(user.role);
		expect(dbUser.displayName).toEqual(user.displayName);
		expect(dbUser.mainPhoneNumber).toEqual(user.mainPhoneNumber);
		expect(dbUser.altPhoneNumber).toEqual(user.altPhoneNumber);
		expect(dbUser.email).toEqual(user.email);
		expect(dbUser.address).toEqual(user.address);
	});

});