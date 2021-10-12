import { deleteRequest, openSession } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { StatusCodes } from "http-status-codes";
import { SessionDto, UserDto } from "@/models/dto";
import { MessageType, TaskMessageModel } from "@/models/Message";
import { FEED } from "@/sockets/feed";
import { Role, UserModel } from "@/models/User";

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
			lastUpdate: 0,
			room: `${FEED}:${user._id}`,
			type: MessageType.Task
		});
		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});

		await deleteRequest(endpoint + task._id, session.auth)
			.send()
			.expect(StatusCodes.NO_CONTENT);

		const dbTask = await TaskMessageModel.findById(task._id);
		expect(dbTask).toBeNull();
	});

});