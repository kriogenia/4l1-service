import { UserMinDto } from "@/models/dto";
import { create } from "@/services/NotificationService";
import { RootEvent } from "@/sockets";
import { FeedEvent } from "@/sockets/feed";
import { GlobalRoomEvent } from "@/sockets/global";
import { io } from "@server";
import { SocketTestHelper } from "@test-util/SocketSetUp";
import { mocked } from "ts-jest/utils";

/** Needed mock for socket tests */
jest.mock("@server");
jest.mock("@/services/UserService");
jest.mock("@/services/NotificationService");

describe("Joining the feed", () => {

	mocked(io);
	mocked(create);

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