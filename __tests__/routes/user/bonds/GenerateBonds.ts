import { SessionPackage } from "@/interfaces";
import { User } from "@/models/User";
import * as db from "@test-util/MongoMemory";
import { getRequest, openSession } from "@test-util/SessionSetUp";
import { StatusCodes } from "http-status-codes";
import { LeanDocument } from "mongoose";
import * as jwt from "jsonwebtoken";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/bond/generate";

describe("Calling GET /user/bond/generate", () => {

	let session: SessionPackage;
	let user: LeanDocument<User>;

	beforeEach((done) => {
		openSession((response) => {
			session = response.session;
			user = response.user;
			if (session && user) {
				done();
			}
		});
	});

	it("should provide a valid bonding token", async () => {
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);
		const { code } = response.body;
		const decoded = jwt.verify(code, process.env.BOND_TOKEN_SECRET) as jwt.JwtPayload;
		expect(decoded.sessionId).toBe(user._id);
	});


});
