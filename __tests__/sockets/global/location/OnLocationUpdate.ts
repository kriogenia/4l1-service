import { LocationEvent } from "@/sockets/location";
import { Message } from "@/sockets/location/OnLocationUpdate";
import { SocketTestHelper } from "@test-util/SocketSetUp";

describe("Updating the location", () => {

	const s = new SocketTestHelper();

	const update: Message = {
		id: "id",
		displayName: "name",
		position: {
			latitude: 0,
			longitude: 1
		}
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should broadcast the location to the rest of users",
	(done) => {
		s.joinLocation(() => {
			s.clientB.on(LocationEvent.UPDATE, (msg: Message) => {
				expect(msg).toEqual(update);
				done();
			});

			s.clientA.emit(LocationEvent.UPDATE, update);
		});
	});

});