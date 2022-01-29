import { Role, User, UserModel } from "@/models/User";
import * as UserService from "@/services/UserService";
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
		await UserService.bond(patient._id, keeper._id);

		const storedPatient = await UserModel.findById(patient._id);
		expect(storedPatient.bonds.length).toBe(1);
		expect(storedPatient.bonds[0]).toEqual(keeper._id);
		const storedKeeper = await UserModel.findById(keeper._id);
		expect(storedKeeper.cared).toEqual(patient._id);
	});	

	it("should throw an error when the user roles are wrong", async () => {
		const blank = await UserModel.create({
			googleId: "keeper",
			role: Role.Blank
		});

		const message = "Invalid bond. The correct bond is PATIENT bonds with KEEPER";
		expect.assertions(5);
		await UserService.bond(keeper._id, patient._id).catch(e => { expect(e).toEqual(Error(message))});
		await UserService.bond(keeper._id, blank._id).catch(e => { expect(e).toEqual(Error(message))});
		await UserService.bond(blank._id, keeper._id).catch(e => { expect(e).toEqual(Error(message))});
		await UserService.bond(blank._id, patient._id).catch(e => { expect(e).toEqual(Error(message))});
		await UserService.bond(patient._id, blank._id).catch(e => { expect(e).toEqual(Error(message))});
		await UserService.bond(patient._id, keeper._id).catch(e => { expect(e).toEqual(Error(message))});
	});

	it("should throw an error when the patient has the max number of bonds", async () => {
		for (let i = 0; i < parseInt(process.env.MAX_BONDS); i++) {
			patient.bonds.push(new mongoose.Types.ObjectId());
		}
		await patient.save();

		expect.assertions(1);
		return UserService.bond(patient._id, keeper._id).catch(e => { 
			expect(e).toEqual(badRequestError(ERR_MSG.maximum_bonds_reached))
		});
	});

	it("should throw an error when the keeper is already kept", async () => {
		keeper.cared = patient._id;
		await keeper.save();

		expect.assertions(1);
		return UserService.bond(patient._id, keeper._id).catch(e => { 
			expect(e).toEqual(badRequestError(ERR_MSG.keeper_already_bonded))
		});
	});

});

describe("The unbond function", () => {

	let patient: User;
	let keeper: User;
	let other: User;

	beforeEach(async () => {
		patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		keeper = await UserModel.create({
			googleId: "keeper",
			role: Role.Keeper
		});
		other = await UserModel.create({
			googleId: "other",
			role: Role.Keeper
		});
		await UserService.bond(patient._id, other._id);
		await UserService.bond(patient._id, keeper._id);
	});

	it("should remove the bond when a Patient removes a KeeperBond", async () => {
		await UserService.unbond(patient._id, keeper._id);

		const storedPatient = await UserModel.findById(patient._id);
		expect(storedPatient.bonds.length).toBe(1);
		expect(storedPatient.bonds[0]).not.toEqual(keeper._id);

		const storedKeeper = await UserModel.findById(keeper._id);
		expect(storedKeeper.cared).toBeNull();
	});	

	it("should remove the bond when a Keeper removes a Patient", async () => {
		await UserService.unbond(keeper._id, patient._id);

		const storedKeeper = await UserModel.findById(keeper._id);
		expect(storedKeeper.cared).toBeNull();
		const storedPatient = await UserModel.findById(patient._id);
		expect(storedPatient.bonds.length).toBe(1);
		expect(storedPatient.bonds[0]).not.toEqual(keeper._id);
	});	

	it("should throw an error when the user roles are wrong", async () => {
		const blank = await UserModel.create({
			googleId: "keeper",
			role: Role.Blank
		});

		const message = "Invalid unbonding. BLANK users can't have bonds";
		expect.assertions(2);
		await UserService.unbond(blank._id, patient._id).catch(e => { expect(e).toEqual(Error(message))});
		await UserService.unbond(keeper._id, blank._id).catch(e => { expect(e).toEqual(Error(message))});
	});

	it("should do nothing when the bond does not exist", async () => {
		await UserService.unbond(patient._id, keeper._id);
		// Already unbonded, same result
		await UserService.unbond(patient._id, keeper._id);
		const storedPatient = await UserModel.findById(patient._id);
		expect(storedPatient.bonds.length).toBe(1);
		expect(storedPatient.bonds[0]).not.toEqual(keeper._id);
		const storedKeeper = await UserModel.findById(keeper._id);
		expect(storedKeeper.cared).toBeNull();
	});

});

describe("The cared request", () => {

	it("should return the data of the user cared when it exists", async () => {
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		const keeper = await UserModel.create({
			googleId: "keeper",
			role: Role.Keeper,
			cared: patient
		});

		expect.assertions(2);
		return UserService.getCared(keeper._id)
			.then((cared) => {
				expect(cared._id).toEqual(patient._id);
				expect(cared.role).toEqual(patient.role);
			});
	});

	it("should return null if the user doesn't have any cared user", async () => {
		const keeper = await UserModel.create({
			googleId: "patient",
			role: Role.Keeper
		});

		expect.assertions(1);
		return UserService.getCared(keeper._id)
			.then((cared) => {
				expect(cared).toBeNull();
			});
	});

	it("should throw an error when the requestor is not a Keeper", async () => {
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});

		expect.assertions(1);
		return UserService.getCared(patient._id)
			.catch((e: Error) => {
				expect(e.message).toEqual(ERR_MSG.only_keepers_cared);
			});
	});

});

describe("The patient bonds list request", () => {

	it("should return the full list of bonds of the user when they exist", async () => {
		const keeper1 = UserModel.create({
			googleId: "keeper1",
			displayName: "keeper1",
			role: Role.Keeper
		});
		const keeper2 = UserModel.create({
			googleId: "keeper2",
			displayName: "keeper2",
			role: Role.Keeper
		});
		const keeper3 = UserModel.create({
			googleId: "keeper3",
			displayName: "keeper3",
			role: Role.Keeper
		});
		const patient = await UserModel.create({
			googleId: "patient",
			displayName: "patient",
			role: Role.Patient,
			bonds: [ (await keeper1)._id, (await keeper2)._id, (await keeper3)._id ]
		});

		const bonds = await UserService.getBonds(patient._id);

		expect(bonds.length).toBe(3);
		expect(bonds[0].displayName).toEqual((await keeper1).displayName);
		expect(bonds[1].displayName).toEqual((await keeper2).displayName);
		expect(bonds[2].displayName).toEqual((await keeper3).displayName);
	});

	it("should return an empty list when the user is not bonded", async () => {
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});

		const bonds = await UserService.getBonds(patient._id);

		expect(bonds.length).toBe(0);
	});

	it("should throw an error when the requestor is not a Patient", async () => {
		const keeper = await UserModel.create({
			googleId: "keeper1",
			role: Role.Keeper
		});

		expect.assertions(1);
		return UserService.getBonds(keeper._id)
			.catch((e: Error) => {
				expect(e.message).toEqual(ERR_MSG.only_patients_bond);
			})
	});

});

describe("The cared bonds list request", () => {

	it("should return the full list of bonds of the cared user when they exist", async () => {
		const keeper2 = UserModel.create({
			googleId: "keeper2",
			role: Role.Keeper
		});
		const keeper3 = UserModel.create({
			googleId: "keeper3",
			displayName: "keeper3",
			role: Role.Keeper
		});
		const patient = await UserModel.create({
			googleId: "patient",
			displayName: "patient",
			role: Role.Patient,
			bonds: [ (await keeper2)._id, (await keeper3)._id ]
		});
		const keeper = await UserModel.create({
			googleId: "keeper1",
			displayName: "keeper1",
			role: Role.Keeper
		});
		await patient.bondWith(keeper);

		const bonds = await UserService.getBondsOfCared(keeper._id);

		expect(bonds.length).toBe(3);
		expect(bonds[0].displayName).toEqual((await keeper2).displayName);
		expect(bonds[1].displayName).toEqual((await keeper3).displayName);
		expect(bonds[2].displayName).toEqual(keeper.displayName);
	});

	it("should throw an error when the requestor is not bonded", async () => {
		const keeper = await UserModel.create({
			googleId: "keeper1",
			role: Role.Keeper
		});

		expect.assertions(1);
		return UserService.getBondsOfCared(keeper._id)
			.catch((e: Error) => {
				expect(e.message).toEqual(ERR_MSG.keeper_not_bonded);
			});
	});

});

describe("The get role function", () => {

	it("should return the role of the user if it exists", async () => {
		const keeper = await UserModel.create({
			googleId: "keeper1",
			role: Role.Keeper
		});
		const role = await UserService.getRole(keeper._id);

		expect(role).toBe(Role.Keeper);
	});

})

describe("The function getUserByGoogleId", () => {

	it ("should generate a new user when no matching user exists", (done) => {
		const googleId = "googleId";
		UserService.getByGoogleId(googleId)
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
		return UserService.getByGoogleId(googleId)
			.then((user) => {
				expect(user.id).toEqual(expected.id);
				expect(user.displayName).toBe(expected.displayName);
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

		await UserService.update(user);
		const dbUser = await UserModel.findById(user._id);

		expect(dbUser.role).toEqual(user.role);
		expect(dbUser.displayName).toEqual(user.displayName);
		expect(dbUser.mainPhoneNumber).toEqual(user.mainPhoneNumber);
		expect(dbUser.altPhoneNumber).toEqual(user.altPhoneNumber);
		expect(dbUser.email).toEqual(user.email);
		expect(dbUser.address).toEqual(user.address);
	});

});