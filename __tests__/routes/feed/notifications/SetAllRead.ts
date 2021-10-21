import { openSession, postRequest } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import { SessionDto, UserDto } from "@/models/dto";
import { Action, NotificationModel } from "@/models/Notification";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/feed/notifications/read";

describe("Calling POST " + endpoint, () => {

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

	it(`should set the notifications of the user as read`, async () => {
		await fillDb(user);
		
		await postRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);
	});
	
});

const fillDb = (user: UserDto) => {
	return new Promise((resolve, _reject) => {
		NotificationModel.create(new Array(10).fill({}).map(() => {
			return {
				action: Action.BOND_CREATED,
				instigator: user._id,
				timestamp: 0,
				interested: [ user._id ]
			}
		}), resolve);
	});
}