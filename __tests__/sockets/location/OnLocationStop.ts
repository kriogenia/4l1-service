import { UserMinDto } from "@/models/dto";
import { removeSharingLocation } from "@/services/NotificationService";
import { LocationEvent } from "@/sockets/location";
import { SocketTestHelper } from "@test-util/SocketSetUp";
import { mocked } from "ts-jest/utils";

/** Needed mock for socket tests */
jest.mock("@/services/UserService");
jest.mock("@/services/NotificationService");

describe("Stop sharing the location", () => {

	const s = new SocketTestHelper();

	const stop: UserMinDto = {
		_id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should broadcast the notification to the rest of users",
	(done) => {
		mocked(removeSharingLocation).mockReturnValue(Promise.resolve(null));

		s.joinLocation(() => {
			s.clientB.on(LocationEvent.STOP, (msg: UserMinDto) => {
				expect(msg).toEqual(stop);
				done();
			});

			s.clientA.emit(LocationEvent.STOP, stop);
		});
	});


});