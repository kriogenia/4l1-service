import { FeedModel, MessageType, Message, TextMessage, TaskMessage } from "@/models/Message";
import { Role, User, UserModel, UserSchema } from "@/models/User";
import { create, DEFAULT_PAGE, getBatch } from "@/services/FeedService";
import * as db from "@test-util/MongoMemory";
import { Ref } from "@typegoose/typegoose";

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

	it ("should persist text messages", (done) => {
		const message: Message = {
			message: "message",
			submitter: author._id,
			username: author.displayName,
			timestamp: 0,
			lastUpdate: 0,
			type: MessageType.Text,
			room: "room"
		};

		create(message).then((persisted: TextMessage) => {
			expect(persisted.id).not.toBeNull();
			expect(persisted.message).toBe(message.message);
			expect(persisted.submitter).toBe(author._id);
			expect(persisted.username).toEqual(author.displayName);
			expect(persisted.timestamp).toBe(message.timestamp);
			expect(persisted.lastUpdate).toBe(message.lastUpdate);
			expect(persisted.type).toEqual(message.type);
			expect(persisted.room).toEqual(message.room);
			done();
		});

	});

	it ("should persist task messages", (done) => {
		const message: Message = {
			title: "title",
			description: "description",
			done: false,
			submitter: author._id,
			username: author.displayName,
			timestamp: 0,
			lastUpdate: 0,
			type: MessageType.Task,
			room: "room"
		};

		create(message).then((persisted: TaskMessage) => {
			expect(persisted.id).not.toBeNull();
			expect(persisted.title).toBe(message.title);
			expect(persisted.description).toBe(message.description);
			expect(persisted.done).toEqual(message.done);
			expect(persisted.submitter).toBe(author._id);
			expect(persisted.username).toEqual(author.displayName);
			expect(persisted.timestamp).toBe(message.timestamp);
			expect(persisted.lastUpdate).toBe(message.lastUpdate);
			expect(persisted.type).toEqual(message.type);
			expect(persisted.room).toEqual(message.room);
			done();
		});

	});

});

describe("The batch retrieval with a collection of x elements and a size of y", () => {

	const room = "room";
	const total = 7;
	const size = 5;

	beforeEach((done) => {
		const messages: Message[] = new Array(total).fill({}).map((_, index) => {
			return {
				message: index.toString(),
				submitter: author._id as unknown as Ref<UserSchema>,
				username: author.displayName,
				timestamp: index,
				lastUpdate: index,
				type: MessageType.Text,
				room: room
			}
		});
		FeedModel.create(messages, done);
	});

	it("should retrieve the last y messages with no page requested", (done) => {
		expect.assertions(size + 1);
		getBatch(room, DEFAULT_PAGE, size).then((messages) => {
			expect(messages.length).toBe(size);
			messages.forEach((msg) => {
				expect(msg.timestamp).toBeGreaterThanOrEqual(total - size);
			});
			done();
		});
	});

	it("should retrieve the first x-y messages when requesting the second page", (done) => {
		expect.assertions(total - size + 1);
		getBatch(room, DEFAULT_PAGE + 1, size).then((messages) => {
			expect(messages.length).toBe(total - size);
			messages.forEach((msg) => {
				expect(msg.timestamp).toBeLessThan(total - size);
			});
			done();
		});
	});

});