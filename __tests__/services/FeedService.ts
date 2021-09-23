import { FeedModel, MessageType } from "@/models/Message";
import { Role, User, UserModel } from "@/models/User";
import { create, DEFAULT_PAGE, getBatch, MessageData } from "@/services/FeedService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

let author: User;

beforeEach(async () => {
	author = await UserModel.create({
		googleId: "patient",
		role: Role.Patient
	});
});

describe("The create operation", () => {

	it ("should persist the new message", (done) => {
		const message: MessageData = {
			message: "message",
			user: author._id,
			timestamp: 0,
			type: MessageType.Text,
			room: "room"
		};

		expect.assertions(6);
		create(message).then((persisted) => {
			expect(persisted.id).not.toBeNull();
			expect(persisted.message).toBe(message.message);
			expect(persisted.user).toBe(author._id);
			expect(persisted.timestamp).toBe(message.timestamp);
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
		const messages: MessageData[] = new Array(total).fill({}).map((_, index) => {
			return {
				message: index.toString(),
				user: author._id,
				timestamp: index,
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