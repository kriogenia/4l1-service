import { generatePair } from "@/services/TokenService";
import * as jwt from "jsonwebtoken";

describe("The pair generation", () => {

	it("should generate two valid tokens and the expected auth expiration time", () => {
		const beforeTime = Math.floor(Date.now() / 1000);
		const pair = generatePair("id");
		const afterTime = Math.floor(Date.now() / 1000);
		// Check auth token
		const decodedAuth = jwt.verify(pair.auth, process.env.AUTH_TOKEN_SECRET) as jwt.JwtPayload;
		expect(decodedAuth.sessionId).toBe("id");
		// Check refresh token
		const decodedRefresh = jwt.verify(pair.refresh, process.env.REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
		expect(decodedRefresh.sessionId).toBe("id");
		// Check expiration time
		const exp = pair.expiration;
		const sixty_min = 60 * 60;
		expect(exp).toBeGreaterThanOrEqual(beforeTime + sixty_min);
		expect(exp).toBeLessThanOrEqual(afterTime + sixty_min);
	});

})