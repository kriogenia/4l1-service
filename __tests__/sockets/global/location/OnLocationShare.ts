import { RootEvent } from "@/sockets";
import { GlobalRoomEvent } from "@/sockets/global";
import { LocationEvent } from "@/sockets/location";
import { Data } from "@/sockets/location/OnLocationShare";
import { SocketTestHelper } from "@test-util/SocketSetUp";

describe("Start sharing the location", () => {

	const s = new SocketTestHelper();

	const share: Data = {
		id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should connect the user to the location room and notify the other users",
	(done) => {
		s.joinGlobal(() => {
			s.clientA.on(GlobalRoomEvent.SHARING_LOCATION, (msg: Data) => {
				expect(msg).toEqual(share);
				done();
			});

			s.clientB.emit(LocationEvent.SHARE, share);
		});
	});

	it("should disconnect the user if it's not connected to any global room",
	(done) => {
		s.clientA.on(RootEvent.DISCONNECT, () => { 
			done()
		});

		s.clientA.emit(LocationEvent.SHARE, share);
	});


});