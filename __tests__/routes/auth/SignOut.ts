import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import * as TokenService from "@/services/TokenService";
import * as SessionService from "@/services/SessionService";
import { deleteRequest } from "@test-util/SessionSetUp";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/auth/session/";

describe("Calling DELETE " + endpoint, () => {

	it("should close the active session", 
	async () => {
		// Open the session
		const auth = TokenService.sessionPackage("signOut").auth;
		expect(SessionService.isSessionOpen(auth)).toBeTruthy();
		// Request to close it
		await deleteRequest(endpoint + auth, auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);
		return SessionService.isSessionOpen(auth)
			.then((isOpen) => {
				expect(isOpen).toBeFalsy();
			});
	});

});