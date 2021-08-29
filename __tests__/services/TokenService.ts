import { SessionPackage } from "@/interfaces";
import * as SessionService from "@/services/SessionService";
import { extractId, sessionPackage, refresh, checkPackage, bond } from "@/services/TokenService";
import { ERR_MSG } from "@/shared/errors";
import { mocked } from "ts-jest/utils";
import * as jwt from "jsonwebtoken";

/** Session service mock */
jest.mock("@/services/SessionService");

const id = "tokenservice";

describe("The token generation", () => {

	it("should generate two valid tokens and the expected auth expiration time", () => {
		const pack = sessionPackage("tokenservice");
		verifyPackage(pack);
	});

});

describe("The bonding token generation", () => {

	it("should generate a valid bonding token of the requested id", () => {
		const id = "bonding";
		const bonding = bond(id);
		const decoded = jwt.verify(bonding, process.env.BOND_TOKEN_SECRET) as jwt.JwtPayload;
		expect(decoded.sessionId).toBe(id);
	});

})

describe("The token tuple check", () => {

	const mockCheckSessionTuple =  mocked(SessionService.checkSessionTuple);
	mockCheckSessionTuple.mockImplementation((auth: string, refresh: string) => {
		return Promise.resolve(auth === refresh);
	});

	it("should return true if the tokens are valid", () => {
		expect.assertions(1);
		expect(checkPackage("tokenservice", "tokenservice")).resolves.toBeTruthy();
	});
	
	it("should return false if the tokens are invalid", () => {
		expect.assertions(1);
		expect(checkPackage("tokenservice", "servicetoken")).resolves.toBeFalsy();
	});

});

describe("The token refresh", () => {

	const mockIsSessionRefreshable =  mocked(SessionService.isSessionRefreshable);

	const authToken = jwt.sign(
		{ sessionId : id }, 
		process.env.AUTH_TOKEN_SECRET, 
		{ expiresIn: process.env.AUTH_TOKEN_EXPIRATION_TIME }
	);

	it("should generate a new session package when provided with valid tokens", 
	(done) => {
		mockIsSessionRefreshable.mockImplementation((_token: string) => {
			return Promise.resolve(true);
		});

		const refreshToken = jwt.sign(
			{ sessionId : id }, 
			process.env.REFRESH_TOKEN_SECRET, 
			{ expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME }
		);
		
		refresh(authToken, refreshToken)
			.then((pack) => {
				verifyPackage(pack);
				done();
			});
	});
	
	it("should throw an error if the refresh token is not active", 
	async () => {
		mockIsSessionRefreshable.mockImplementation((_token: string) => {
			return Promise.resolve(false);
		});

		const refreshToken = jwt.sign(
			{ sessionId : id }, 
			process.env.REFRESH_TOKEN_SECRET, 
			{ expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME }
		);
		
		return refresh(authToken, refreshToken)
			.catch((e: Error) => {
				expect(e.message).toMatch(ERR_MSG.token_invalid)
			});
	});
	
	it("should throw an error if the refresh token is expired", 
	async () => {
		const expiredRefreshToken = jwt.sign(
			{ sessionId : id }, 
			process.env.REFRESH_TOKEN_SECRET, 
			{ expiresIn: "1ms" }
		);

		return refresh(authToken, expiredRefreshToken)
			.catch((e: Error) => {
				expect(e.message).toMatch(ERR_MSG.token_expired)
			});
	});

	it("should throw an error if the refresh token is invalid", 
	async () => {
		return refresh(authToken, "invalid")
			.catch((e: Error) => {
				expect(e.message).toMatch(ERR_MSG.token_invalid)
			});
	});

});

describe("The id extraction", () => {

	it("should return the sessionId stored in the token", () => {
		const token = jwt.sign(
			{ sessionId : id }, 
			"secret"
		);
		expect(extractId(token)).toEqual(id);
	});

});

const verifyPackage = (pack: SessionPackage) => {
	// Check auth token
	const decodedAuth = jwt.verify(pack.auth, process.env.AUTH_TOKEN_SECRET) as jwt.JwtPayload;
	expect(decodedAuth.sessionId).toBe(id);
	// Check refresh token
	const decodedRefresh = jwt.verify(pack.refresh, process.env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
	expect(decodedRefresh.sessionId).toBe(id);
	// Check expiration time
	expect(pack.expiration).toBe(decodedAuth.iat + 60 * 60);
}