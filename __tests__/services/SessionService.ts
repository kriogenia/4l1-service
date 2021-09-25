import { 
	checkSessionTuple, 
	closeSession, 
	isSessionOpen, 
	startSession } from "@/services/SessionService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("The function startSession", () => {

	it ("should build and persist a new session", (done) => {
		const auth = "sessionservice_start_auth";
		const refresh = "sessionservice_start_refresh";
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

describe("The function isSessionOpen", () => {

	it("should return true when requested with an active session", (done) => {
		const auth = "sessionservice_isopen_auth";
		const refresh = "sessionservice_isopen_refresh";
		const expiration = 1000;

		expect.assertions(1);
		startSession(auth, refresh, expiration)
			.then(() => isSessionOpen(auth))
			.then((isOpen) => {
				expect(isOpen).toBeTruthy();
				done();
			});
	});
	
	it("should return false when requested with an active session", (done) => {
		expect.assertions(1);
		isSessionOpen("not_open")
			.then((isOpen) => {
				expect(isOpen).toBeFalsy();
				done();
			});
	});

});

describe("The function closeSession", () => {

	it("should remove the session when requested an active session", (done) => {
		const auth = "sessionservice_close_auth";
		const refresh = "sessionservice_close_refresh";
		const expiration = 1000;

		expect.assertions(3);
		startSession(auth, refresh, expiration)
			.then(() => isSessionOpen(auth))
			.then((isOpen) => {
				expect(isOpen).toBeTruthy();
				return closeSession(refresh);
			})
			.then((number) => {
				expect(number).toBe(1);
				return isSessionOpen(auth);
			})
			.then((isOpen) => {
				expect(isOpen).toBeFalsy();
				done();
			});
	});

	it("should remove zero sessions when requested inactive sessions", (done) => {
		expect.assertions(1);
		closeSession("inactive")
			.then((number) => {
				expect(number).toBe(0);
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
		.then((session) => checkSessionTuple(session.auth, session.refresh))
		.then((isValid) => {
			expect(isValid).toBeTruthy();
			done();
		});
	});
	
	it ("should return false if the refresh token is not active", (done) => {
		const auth = "sessionservice_auth";
		const refresh = "sessionservice_refresh";

		expect.assertions(1);
		checkSessionTuple(auth, refresh)
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
		.then((session) => checkSessionTuple("other", session.refresh))
		.then((isValid) => {
			expect(isValid).toBeFalsy();
			done();
		});
	});

});