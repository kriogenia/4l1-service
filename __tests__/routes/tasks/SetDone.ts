import { deleteRequest, openSession, postRequest } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import { SessionDto, UserDto } from "@/models/dto";
import { MessageType, TaskMessageModel } from "@/models/Message";
import { Role, UserModel } from "@/models/User";
import { FEED } from "@/sockets/feed";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/tasks/";
const endpointEnd = "/done";

describe("Calling " + endpoint + ":id" + endpointEnd, () => {

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

	const taskData = {
		title: "title",
		description: "description",
		done: false,
		username: "name",
		timestamp: 0,
		type: MessageType.Task
	}

	it("with POST should set the task as done", async () => {
		const task = await TaskMessageModel.create({
			...taskData,
			submitter: user._id,
			room: `${FEED}:${user._id}`
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});

		await postRequest(endpoint + task._id + endpointEnd, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);

		const dbTask = await TaskMessageModel.findById(task._id);
		expect(dbTask.done).toBeTruthy();
	});

	it("with DELETE should set the task as not done", async () => {
		const task = await TaskMessageModel.create({
			...taskData,
			submitter: user._id,
			room: `${FEED}:${user._id}`
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});

		await deleteRequest(endpoint + task._id + endpointEnd, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);

		const dbTask = await TaskMessageModel.findById(task._id);
		expect(dbTask.done).toBeFalsy();
	});

});