import { openSession, postRequest } from "@test-util/SessionSetUp";
import * as db from "@test-util/MongoMemory";
import { Role, UserModel } from "@/models/User";
import { StatusCodes } from "http-status-codes";
import { SessionDto, TaskDto, TaskMinDto, UserDto } from "@/models/dto";
import { TaskMessageModel } from "@/models/Message";

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

const endpoint = "/tasks/";

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

	//test crud endpoint

	it("should create the specified task", async () => {
		const task: TaskMinDto = {
			title: "title",
			description: "description",
			done: false,
			timestamp: 1,
			submitter: {
				_id: user._id,
				displayName: "name"
			}
		}

		await UserModel.findByIdAndUpdate(user._id, {
			role: Role.Patient
		});

		const response = await postRequest(endpoint, session.auth)
			.send(task)
			.expect(StatusCodes.CREATED);

		const body: TaskDto = response.body;
		expect(body.title).toEqual(task.title);
		expect(body.description).toEqual(task.description);
		expect(body.done).toEqual(task.done);
		expect(body.timestamp).toEqual(task.timestamp);
		expect(body.submitter._id.toString()).toMatch(task.submitter._id);
		expect(body.submitter.displayName).toEqual(task.submitter.displayName);
			
		const dbTask = await TaskMessageModel.findById(body._id);
		expect(dbTask.title).toEqual(task.title);
		expect(dbTask.description).toEqual(task.description);
		expect(dbTask.done).toEqual(task.done);
		expect(dbTask.timestamp).toEqual(task.timestamp);
		expect(dbTask.submitter.toString()).toEqual(task.submitter._id);
		expect(dbTask.username).toEqual(task.submitter.displayName);
	});

});