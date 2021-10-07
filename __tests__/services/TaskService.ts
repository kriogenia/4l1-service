import { MessageType, Message, TaskMessage, TaskMessageModel } from "@/models/Message";
import { Role, User, UserModel, UserSchema } from "@/models/User";
import { create, DEFAULT_MAX_AGE, getRelevant } from "@/services/TaskService";
import * as db from "@test-util/MongoMemory";
import { Ref } from "@typegoose/typegoose";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

let author: User;

const daysMillis = 24 * 60 * 60 * 1000;

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

describe("The relevant retrieval", () => {

	const room = "room";
	const total = 7;

	beforeEach((done) => {
		const messages: Message[] = new Array(total).fill({}).map((_, index) => {
			return {
				title: index.toString(),
				done: index % 2 != 0,
				submitter: author._id as unknown as Ref<UserSchema>,
				username: author.displayName,
				timestamp: Date.now() - index * daysMillis,
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
				expect(isRelevant(msg, DEFAULT_MAX_AGE)).toBeTruthy();
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
				expect(isRelevant(msg, days)).toBeTruthy();
			});
			done();
		});
	});

});

const isRelevant = (task: TaskMessage, maxAge: number): boolean => {
	if (!task.done) return true;
	return (task.timestamp <= maxAge * daysMillis);
}