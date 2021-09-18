import { LocationEvent } from "@/sockets/location";
import { Message } from "@/sockets/location/OnLocationStop";
import { SocketTestHelper } from "@test-util/SocketSetUp";

describe("Stop sharing the location", () => {

	const s = new SocketTestHelper();

	const stop: Message = {
		id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should broadcast the notification to the rest of users",
	(done) => {
		s.joinLocation(() => {
			s.clientB.on(LocationEvent.STOP, (msg: Message) => {
				expect(msg).toEqual(stop);
				done();
			});

			s.clientA.emit(LocationEvent.STOP, stop);
		});
	});


});