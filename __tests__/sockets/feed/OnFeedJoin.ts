import { UserMinDto } from "@/models/dto";
import { RootEvent } from "@/sockets";
import { FeedEvent } from "@/sockets/feed";
import { GlobalRoomEvent } from "@/sockets/global";
import { SocketTestHelper } from "@test-util/SocketSetUp";

/** Needed mock for socket tests */
jest.mock("@/services/UserService");

describe("Joining the feed", () => {

	const s = new SocketTestHelper();

	const share: UserMinDto = {
		_id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should connect the user to the feed room and notify the other users",
	(done) => {
		s.joinGlobal(() => {
			s.clientA.on(GlobalRoomEvent.JOINING_FEED, (msg: UserMinDto) => {
				expect(msg).toEqual(share);
				done();
			});

			s.clientB.emit(FeedEvent.JOIN, share);
		});
	});

	it("should disconnect the user if it's not connected to any global room",
	(done) => {
		s.clientA.on(RootEvent.DISCONNECT, () => { 
			done()
		});

		s.clientA.emit(FeedEvent.JOIN, share);
	});

});