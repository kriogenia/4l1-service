import { FeedEvent } from "@/sockets/feed";
import { UserInfo } from "@/sockets/schemas";
import { SocketTestHelper } from "@test-util/SocketSetUp";

/** Needed mock for socket tests */
jest.mock("@/services/UserService");

describe("Leaving the feed room", () => {

	const s = new SocketTestHelper();

	const leave: UserInfo = {
		_id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should broadcast the notification to the rest of users",
	(done) => {
		s.joinFeed(() => {
			s.clientB.on(FeedEvent.LEAVE, (msg: UserInfo) => {
				expect(msg).toEqual(leave);
				done();
			});

			s.clientA.emit(FeedEvent.LEAVE, leave);
		});
	});


});