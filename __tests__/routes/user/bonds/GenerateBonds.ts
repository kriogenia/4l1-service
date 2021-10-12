import * as db from "@test-util/MongoMemory";
import { getRequest, openSession } from "@test-util/SessionSetUp";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { SessionDto, UserDto } from "@/models/dto";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/user/bonds/generate";

describe("Calling GET " + endpoint, () => {

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

	it("should provide a valid bonding token", async () => {
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);
		const { code } = response.body;
		const decoded = jwt.verify(code, process.env.BOND_TOKEN_SECRET) as jwt.JwtPayload;
		expect(decoded.sessionId).toBe(user._id);
	});


});
