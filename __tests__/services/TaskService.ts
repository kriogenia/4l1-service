import { MessageType, Message, TaskMessage, TaskMessageModel } from "@/models/Message";
import { Role, User, UserModel } from "@/models/User";
import { belongsTo, create, DEFAULT_MAX_AGE, getRelevant, remove, update } from "@/services/TaskService";
import { DAY_IN_MILLIS } from "@/shared/values";
import { isTaskRelevant } from "@test-util/checkers";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

let author: User;

beforeEach(async () => {
	author = await UserModel.create({
		displayName: "name",
		googleId: "patient",
		role: Role.Patient
	});
});

describe("The create operation", () => {

	it ("should persist tasks", (done) => {
		const message: Message = {
			title: "title",
			description: "description",
			done: false,
			submitter: author._id,
			username: author.displayName,
			timestamp: 0,
			lastUpdate: 0,
			room: "room"
		};

		expect.assertions(9);
		create(message).then((persisted: TaskMessage) => {
			expect(persisted.id).not.toBeNull();
			expect(persisted.title).toBe(message.title);
			expect(persisted.description).toBe(message.description);
			expect(persisted.done).toEqual(message.done);
			expect(persisted.submitter).toBe(author._id);
			expect(persisted.username).toEqual(author.displayName);
			expect(persisted.timestamp).toBe(message.timestamp);
			expect(persisted.type).toEqual(MessageType.Task);
			expect(persisted.room).toEqual(message.room);
			done();
		});

	});

});

describe("The remove operation", () => {

	it ("should remove the specified task when given a valid id", async () => {
		const task = await TaskMessageModel.create({
			title: "title",
			description: "description",
			done: false,
			submitter: author._id,
			username: author.displayName,
			timestamp: 0,
			lastUpdate: 0,
			room: "room",
			type: MessageType.Task
		});

		await remove(task._id);

		const dbTask = await TaskMessageModel.findById(task._id);
		expect(dbTask).toBeNull();

	});

});

describe("The relevant retrieval", () => {

	const room = "room";
	const total = 7;

	beforeEach((done) => {
		const messages: Message[] = new Array(total).fill({}).map((_, index) => {
			return {
				title: index.toString(),
				done: index % 2 != 0,
				submitter: author._id,
				username: author.displayName,
				timestamp: 0,
				lastUpdate: Date.now() - index * DAY_IN_MILLIS,
				type: MessageType.Text,
				room: room
			}
		});

		TaskMessageModel.create(messages, done);
	});

	it("should retrieve only the relevant tasks of the last 3 days if no age is specified", 
	(done) => {
		getRelevant(room).then((messages) => {
			expect(messages.length).toBe(5);
			messages.forEach((msg) => {
				expect(isTaskRelevant(msg, DEFAULT_MAX_AGE)).toBeTruthy();
			});
			done();
		});
	});

	it("should retrieve only the relevant tasks of the last x days", 
	(done) => {
		const days = 1;
		getRelevant(room, days).then((messages) => {
			messages.forEach((msg) => {
				expect(messages.length).toBe(4);
				expect(isTaskRelevant(msg, days)).toBeTruthy();
			});
			done();
		});
	});


	it("should retrieve all the relevant tasks with a big enough age", 
	(done) => {
		const days = 100;
		getRelevant(room, days).then((messages) => {
			messages.forEach((msg) => {
				expect(messages.length).toBe(7);
				expect(isTaskRelevant(msg, days)).toBeTruthy();
			});
			done();
		});
	});

});

describe("The update", () => {

	it("should update the task with the given data", async () => {
		const task = await TaskMessageModel.create({
			title: "title",
			description: "description",
			done: false,
			submitter: author._id,
			username: author.displayName,
			timestamp: 0,
			lastUpdate: 0,
			room: "room",
			type: MessageType.Task
		});
		
		task.title = "new";
		task.description = "also new";
		task.done = true;
		task.timestamp = 1;

		const currentTime = Date.now();
		await update(task);
		const dbTask = await TaskMessageModel.findById(task._id);

		expect(dbTask.title).toEqual(task.title);
		expect(dbTask.description).toEqual(task.description);
		expect(dbTask.done).toEqual(task.done);
		expect(dbTask.submitter).toEqual(task.submitter);
		expect(dbTask.username).toEqual(task.username);
		expect(dbTask.timestamp).toEqual(task.timestamp);
		expect(dbTask.lastUpdate).toBeGreaterThanOrEqual(currentTime);
	});

});

describe("The room check", () => {

	const taskData = {
		title: "title",
		description: "description",
		done: false,
		username: "name",
		timestamp: 0,
		lastUpdate: 0,
		room: "room",
		type: MessageType.Task
	};

	it("should return true if the task belongs to the specified room", async () => {
		const task = await TaskMessageModel.create({...taskData, submitter: author._id });
		expect(await belongsTo(task._id, task.room)).toBeTruthy();
	});

	it("should return false if the task doesn't belong to the specified room", async () => {
		const task = await TaskMessageModel.create({...taskData, submitter: author._id });
		expect(await belongsTo(task._id, "different")).toBeFalsy();
	});

});
