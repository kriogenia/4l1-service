import { Role, UserModel } from "@/models/User";
import { getByGoogleId, update } from "@/services/UserService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

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

		await update(user);
		const dbUser = await UserModel.findById(user._id);

		expect(dbUser.role).toEqual(user.role);
		expect(dbUser.displayName).toEqual(user.displayName);
		expect(dbUser.mainPhoneNumber).toEqual(user.mainPhoneNumber);
		expect(dbUser.altPhoneNumber).toEqual(user.altPhoneNumber);
		expect(dbUser.email).toEqual(user.email);
	});

});