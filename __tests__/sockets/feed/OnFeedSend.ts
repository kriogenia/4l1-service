import { create } from "@/services/FeedService";
import { FeedEvent } from "@/sockets/feed";
import { SocketTestHelper } from "@test-util/SocketSetUp";
import { mocked } from "ts-jest/utils";
import { Message, MessageType } from "@/models/Message";
import { Ref } from "@typegoose/typegoose";
import { User } from "@/models/User";

jest.mock("@/services/FeedService");
/** Needed mock for socket tests */
jest.mock("@/services/UserService");

describe("Sending a message", () => {

	const s = new SocketTestHelper();

	const mockCreate = mocked(create);

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("of text should send it to all the users and store it",
	(done) => {
		const message: Partial<Message> = {
			message: "message",
			submitter: "fda9ec283b194985a9927fea" as Ref<User>,
			username: "KEEPER",
			timestamp: 1,
			type: MessageType.Text
		}

		const created: Message = {
			_id: "id",
			...message,
			room: `feed:${s.idClientA}`
		};
		mockCreate.mockReturnValue(Promise.resolve(created));

		s.joinFeed(() => {
			s.clientB.on(FeedEvent.NEW, (msg: Message) => {
				expect(msg).toEqual({
					_id: created._id,
					...msg
				});
				expect(mockCreate).toBeCalledWith({
					...message,
					room: `feed:${s.idClientA}`
				});
				done();
			});

			s.clientA.emit(FeedEvent.SEND, message);
		});
	});

	it("with a task should send it to all the users and store it",
	(done) => {
		const message: Partial<Message> = {
			title: "task",
			description: "description",
			done: false,
			submitter: "fda9ec283b194985a9927fea" as Ref<User>,
			username: "KEEPER",
			timestamp: 1,
			type: MessageType.Task
		}
		
		const created: Message = {
			_id: "id",
			...message,
			room: `feed:${s.idClientA}`
		};
		mockCreate.mockReturnValue(Promise.resolve(created));

		s.joinFeed(() => {
			s.clientB.on(FeedEvent.NEW, (msg: Message) => {
				expect(msg).toEqual({
					_id: created._id,
					...msg
				});
				expect(mockCreate).toBeCalledWith({
					...message,
					room: `feed:${s.idClientA}`
				});
				done();
			});

			s.clientA.emit(FeedEvent.SEND, message);
		});
	});


});
