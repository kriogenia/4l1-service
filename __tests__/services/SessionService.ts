import { checkValidTuple, startSession } from "@/services/SessionService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("The function startSession", () => {

	it ("should build and persist a new session", (done) => {
		const auth = "sessionservice_auth";
		const refresh = "sessionservice_refresh";
		const expiration = 1000;

		expect.assertions(4);
		startSession(auth, refresh, expiration)
			.then((session) => {
				expect(session.id).not.toBeNull();
				expect(session.auth).toBe(auth);
				expect(session.refresh).toBe(refresh);
				expect(session.expiration).toBe(expiration);
				done();
			});
	});

});

describe("The function checkValidTuple", () => {

	it ("should return true if the session exists in the database", (done) => {
		const auth = "sessionservice_auth";
		const refresh = "sessionservice_refresh";
		const expiration = 1000;

		expect.assertions(1);
		startSession(auth, refresh, expiration)
		.then((session) => checkValidTuple(session.auth, session.refresh))
		.then((isValid) => {
			expect(isValid).toBeTruthy();
			done();
		});
	});
	
	it ("should return false if the refresh token is not active", (done) => {
		const auth = "sessionservice_auth";
		const refresh = "sessionservice_refresh";

		expect.assertions(1);
		checkValidTuple(auth, refresh)
		.then((isValid) => {
			expect(isValid).toBeFalsy();
			done();
		});
	});
	
	it ("should return false if the tokens are not related", (done) => {
		const auth = "sessionservice_auth";
		const refresh = "sessionservice_refresh";
		const expiration = 1000;

		expect.assertions(1);
		startSession(auth, refresh, expiration)
		.then((session) => checkValidTuple("other", session.refresh))
		.then((isValid) => {
			expect(isValid).toBeFalsy();
			done();
		});
	});

});