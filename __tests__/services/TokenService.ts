import { SessionPackage } from "@/interfaces";
import { generate, refresh } from "@/services/TokenService";
import { ERR_MSG, unathorizedError } from "@/shared/errors";
import * as jwt from "jsonwebtoken";

describe("The token generation", () => {

	it("should generate two valid tokens and the expected auth expiration time", () => {
		const pack = generate("id");
		verifyPackage(pack);
	});

});

describe("The token refresh", () => {

	let id: string;
	let authToken: string;

	beforeEach(() => {
		id = "id";
		authToken = jwt.sign(
			{ sessionId : id }, 
			process.env.AUTH_TOKEN_SECRET, 
			{ expiresIn: process.env.AUTH_TOKEN_EXPIRATION_TIME }
		);
	});

	it("should generate a new session package when provided with valid tokens", 
	(done) => {
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
	
	it("should throw an error if the refresh token is expired", 
	() => {
		const expiredRefreshToken = jwt.sign(
			{ sessionId : id }, 
			process.env.REFRESH_TOKEN_SECRET, 
			{ expiresIn: 1 }
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
	
	it("should throw an error if the tokens are valid but not related", 
	() => {
		const unrelatedRefreshToken = jwt.sign(
			{ sessionId : "other_id" }, 
			process.env.REFRESH_TOKEN_SECRET, 
			{ expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME }
		);
		
		return refresh(authToken,unrelatedRefreshToken)
			.catch((e: Error) => {
				expect(e.message).toMatch(ERR_MSG.tokens_not_related)
			});
	});

});

function verifyPackage(pack: SessionPackage) {
	// Check auth token
	const decodedAuth = jwt.verify(pack.auth, process.env.AUTH_TOKEN_SECRET) as jwt.JwtPayload;
	expect(decodedAuth.sessionId).toBe("id");
	// Check refresh token
	const decodedRefresh = jwt.verify(pack.refresh, process.env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
	expect(decodedRefresh.sessionId).toBe("id");
	// Check expiration time
	expect(pack.expiration).toBe(decodedAuth.iat + 60 * 60);
}

