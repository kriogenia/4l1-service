import { getRequest, openSession } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { Role, UserModel, UserSchema } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { MessageType, TaskMessageModel } from "@/models/Message";
import { FEED } from "@/sockets/feed";
import { SessionDto, TaskDto, UserDto } from "@/models/dto";
import { DAY_IN_MILLIS } from "@/shared/values";
import { isTaskRelevant } from "@test-util/checkers";
import { DEFAULT_MAX_AGE } from "@/services/TaskService";
import { Ref } from "@typegoose/typegoose";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/tasks";
const size = 7;
const expectedSizeWithDefault = 5;

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

	it(`should return the relevant tasks of Patients`, async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});
		await fillDb(user, `${FEED}:${user._id}`);
		
		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const messages: TaskDto[] = response.body.tasks;
		expect(messages.length).toBe(expectedSizeWithDefault);
		expect(messages.every((t) => isTaskRelevant(t, DEFAULT_MAX_AGE))).toBeTruthy();
	});

	// TODO give a look to this tests, it fails half the times
	it(`should return the relevant tasks of Keepers`, async () => {
		const patient = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Keeper,
			cared: patient
		});
		await fillDb(user, `${FEED}:${patient._id as string}`);

		const response = await getRequest(endpoint, session.auth)
			.send()
			.expect(StatusCodes.OK);

		const messages: TaskDto[] = response.body.tasks;	
		expect(messages.length).toBe(expectedSizeWithDefault);
		expect(messages.every((t) => isTaskRelevant(t, DEFAULT_MAX_AGE))).toBeTruthy();
	});

	it("should return the tasks meeting the max age", async () => {
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});
		await fillDb(user, `${FEED}:${user._id}`);

		const response = await getRequest(endpoint, session.auth)
			.query({ maxDays: 100 })
			.send()
			.expect(StatusCodes.OK);

		const messages: TaskDto[] = response.body.tasks;	
		expect(messages.length).toBe(size);
	});
	
});

const fillDb = (user: UserDto, room: string) => {
	return new Promise((resolve, _reject) => {
		TaskMessageModel.create(new Array(size).fill({}).map((_, index) => {
			return {
				title: index.toString(),
				done: index % 2 != 0,
				submitter: user._id as unknown as Ref<UserSchema>,
				username: "name",
				timestamp: 0,
				lastUpdate: Date.now() - index * DAY_IN_MILLIS,
				type: MessageType.Task,
				room: room
			}
		}), resolve);
	});
}