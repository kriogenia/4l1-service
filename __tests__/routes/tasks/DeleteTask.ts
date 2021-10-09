import { deleteRequest, openSession } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import { SessionDto, UserDto } from "@/models/dto";
import { MessageType, TaskMessageModel } from "@/models/Message";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/tasks/";

describe("Calling DELETE " + endpoint + ":id", () => {

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

	it("should delete the specified task", async () => {
		const task = await TaskMessageModel.create({
			title: "title",
			description: "description",
			done: false,
			submitter: user._id,
			username: "name",
			timestamp: 0,
			room: "room",
			type: MessageType.Task
		});

		await deleteRequest(endpoint + task._id, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);

		const dbTask = await TaskMessageModel.findById(task._id);
		expect(dbTask).toBeNull();
	});

});