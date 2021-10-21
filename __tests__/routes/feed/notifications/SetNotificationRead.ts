import { openSession, postRequest } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import { SessionDto, UserDto } from "@/models/dto";
import { Action, NotificationModel } from "@/models/Notification";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/feed/notifications/";
const endpoitTail = "/read"

describe("Calling POST " + endpoint + ":id" + endpoitTail, () => {

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

	it(`should set the notification as read by the user`, async () => {
		const notification = await NotificationModel.create({
				action: Action.BOND_CREATED,
				instigator: user._id,
				timestamp: 0,
				interested: [ user._id ]
			});
		
		const id = notification._id as string;
		await postRequest(endpoint + id + endpoitTail, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);

		const inDb = await NotificationModel.findById(notification._id);
		expect(inDb).toBeNull();
	});
	
});