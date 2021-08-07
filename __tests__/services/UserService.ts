import { AppAuthCredentials } from "@/interfaces";
import { Role, UserModel } from "@/models/User";
import { getUserByGoogleId } from "@/services/UserService";
import * as db from "@test-util/MongoMemory";

/* Test catabase deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("The function getUserByGoogleId", () => {

	it ("should generate a new user when no matching user exists", (done) => {
		const credentials: AppAuthCredentials = {
			givenName: "name",
			familyName: "surname",
			id: "test"
		};
		getUserByGoogleId(credentials)
			.then((user) => {
				expect(user.id).not.toBeNull();
				expect(user.givenName).toBe(credentials.givenName);
				expect(user.familyName).toBe(credentials.familyName);
				expect(user.googleId).toBe(credentials.id);
				expect(user.role).toBe(Role.Blank);
				done();
			})
			.catch(done);
	});
	
	it ("should return the matching user", async () => {
		const credentials: AppAuthCredentials = {
			id: "test"
		};
		// insert the user
		const expected = await UserModel.create({
			googleId: credentials.id,
			role: Role.Keeper
		});
		return getUserByGoogleId(credentials)
			.then((user) => {
				expect(user.id).toEqual(expected.id);
				expect(user.givenName).toBe(expected.givenName);
				expect(user.familyName).toBe(expected.familyName);
				expect(user.googleId).toBe(expected.googleId);
				expect(user.role).toBe(expected.role);
			});
	});

});