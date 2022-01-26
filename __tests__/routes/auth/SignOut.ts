import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import * as TokenService from "@/services/TokenService";
import * as SessionService from "@/services/SessionService";
import { deleteRequest, openSession } from "@test-util/SessionSetUp";
import { SessionDto, UserDto } from "@/models/dto";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/auth/session/";

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

	it("should close the active session if requested by the user", 
	async () => {
		const auth = session.auth;
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

	it("should throw an error if requested by a different user", 
	async () => {
		const auth = TokenService.sessionPackage("different").auth;
		expect(SessionService.isSessionOpen(auth)).toBeTruthy();
		expect(SessionService.isSessionOpen(session.auth)).toBeTruthy();
		// Request to close it
		await deleteRequest(endpoint + session.auth, auth)
			.send()
			.expect(StatusCodes.FORBIDDEN);
		return SessionService.isSessionOpen(session.auth)
			.then((isOpen) => {
				expect(isOpen).toBeTruthy();
			});
	});
});