import { Role, UserModel } from "@/models/User";
import { getUserByGoogleId } from "@/services/UserService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("The function getUserByGoogleId", () => {

	it ("should generate a new user when no matching user exists", (done) => {
		const googleId = "googleId";
		getUserByGoogleId(googleId)
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
		return getUserByGoogleId(googleId)
			.then((user) => {
				expect(user.id).toEqual(expected.id);
				expect(user.displayName).toBe(expected.displayName);
				expect(user.googleId).toBe(expected.googleId);
				expect(user.role).toBe(expected.role);
			});
	});

});