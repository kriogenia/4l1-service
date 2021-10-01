import { create } from "@/services/FeedService";
import { FeedEvent } from "@/sockets/feed";
import { SocketTestHelper } from "@test-util/SocketSetUp";
import { mocked } from "ts-jest/utils";
import { Input, Output } from "@/sockets/feed/OnFeedSend";
import { Message, MessageType } from "@/models/Message";
import { Ref } from "@typegoose/typegoose";
import { User } from "@/models/User";
import { objectId } from "@/Mongo";

jest.mock("@/services/FeedService");
/** Needed mock for socket tests */
jest.mock("@/services/UserService");

describe("Sending a message", () => {

	const s = new SocketTestHelper();

	const mockCreate = mocked(create);

	const message: Input = {
		message: "message",
		submitter: {
			_id: "fda9ec283b194985a9927fea",
			displayName: "KEEPER"
		},
		timestamp: 1
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should send it to all the users and store it",
	(done) => {
		const created: Message = {
			_id: "id",
			submitter: message.submitter._id as Ref<User>,
			username: message.submitter.displayName,
			timestamp: message.timestamp,
			type: MessageType.Text,
			room: `feed:${s.idClientA}`
		};
		mockCreate.mockReturnValue(Promise.resolve(created));

		s.joinFeed(() => {
			s.clientB.on(FeedEvent.NEW, (msg: Output) => {
				expect(msg).toEqual({
					_id: created._id,
					...msg
				});
				expect(mockCreate).toBeCalledWith({
					message: message.message,
					submitter: objectId(message.submitter._id),
					username: message.submitter.displayName,
					timestamp: message.timestamp,
					type: MessageType.Text,
					room: `feed:${s.idClientA}`
				});
				done();
			});

			s.clientA.emit(FeedEvent.SEND, message);
		});
	});


});
