import { getRequest, openSession } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import { NotificationDto, SessionDto, UserDto } from "@/models/dto";
import { DAY_IN_MILLIS } from "@/shared/values";
import { Action, NotificationModel } from "@/models/Notification";
import { DEFAULT_MAX_AGE } from "@/services/NotificationService";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/feed/notifications";
const size = 10;
const expectedSizeWithDefault = 4;

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

	it(`should return the unread notifications of the user`, async () => {
		const maxAge = DEFAULT_MAX_AGE;
		await fillDb(user);
		
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const notifications: NotificationDto[] = response.body.notifications;
		expect(notifications.length).toBe(expectedSizeWithDefault);
		notifications.forEach((n) => {
			expect(n.timestamp).toBeGreaterThanOrEqual(Date.now() - maxAge * DAY_IN_MILLIS - 1000)
		});
	});

	it("should return the unread notifications meeting the max age", async () => {
		const maxAge = 100;
		await fillDb(user);

		const response = await getRequest(endpoint, session.auth)
			.query({ maxDays: maxAge })
			.send()
			.expect(StatusCodes.OK);

			const notifications: NotificationDto[] = response.body.notifications;
			expect(notifications.length).toBe(size/2);
			notifications.forEach((n) => {
				expect(n.timestamp).toBeGreaterThanOrEqual(Date.now() - maxAge * DAY_IN_MILLIS - 1000)
			});
	});
	
});

const fillDb = (user: UserDto) => {
	return new Promise((resolve, _reject) => {
		NotificationModel.create(new Array(size).fill({}).map((_, index) => {
			return {
				action: Action.BOND_CREATED,
				instigator: user._id,
				timestamp: Date.now() - index * DAY_IN_MILLIS,
				interested: (index % 2 === 0) ? [ user._id ] : []
			}
		}), resolve);
	});
}