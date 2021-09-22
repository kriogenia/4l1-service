import { LocationEvent } from "@/sockets/location";
import { UserInfo } from "@/sockets/schemas";
import { SocketTestHelper } from "@test-util/SocketSetUp";

/** Needed mock for socket tests */
jest.mock("@/services/UserService");

describe("Stop sharing the location", () => {

	const s = new SocketTestHelper();

	const stop: UserInfo = {
		_id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should broadcast the notification to the rest of users",
	(done) => {
		s.joinLocation(() => {
			s.clientB.on(LocationEvent.STOP, (msg: UserInfo) => {
				expect(msg).toEqual(stop);
				done();
			});

			s.clientA.emit(LocationEvent.STOP, stop);
		});
	});


});