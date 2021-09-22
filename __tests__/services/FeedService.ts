import { MessageType } from "@/models/Message";
import { Role, User, UserModel } from "@/models/User";
import { create, MessageData } from "@/services/FeedService";
import * as db from "@test-util/MongoMemory";

/* Test database deployment and management */
beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.close);

describe("The create operation", () => {

	let author: User;

	beforeAll(async () => {
		author = await UserModel.create({
			googleId: "patient",
			role: Role.Patient
		});
	})

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