import { NotificationDto, UserMinDto } from "@/models/dto";
import { Action, NOTIFY, Notification } from "@/models/Notification";
import { create } from "@/services/NotificationService";
import { RootEvent } from "@/sockets";
import { LocationEvent } from "@/sockets/location";
import { SocketTestHelper } from "@test-util/SocketSetUp";
import { mocked } from "ts-jest/utils";

jest.mock("@/services/NotificationService");
/** Needed mock for socket tests */
jest.mock("@/services/UserService");

describe("Start sharing the location", () => {

	const s = new SocketTestHelper();

	const share: UserMinDto = {
		_id: "keeper",
		displayName: "KEEPER"
	}

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	it("should connect the user to the location room and notify the other users",
	(done) => {
		const action = Action.LOCATION_SHARING_START;
		const created: Partial<Notification> = {
			event: `${NOTIFY}:${action}`,
			dto: jest.fn().mockReturnValue({
				_id: "id",
				action: action,
				instigator: share.displayName,
				timestamp: 0,
			})
		};
		mocked(create).mockReturnValue(Promise.resolve(created as Notification));

		s.joinGlobal(() => {
			s.clientA.on(`${NOTIFY}:${action}`, (msg: NotificationDto) => {
				expect(msg._id).toBe("id");
				expect(msg.action).toBe(action);
				expect(msg.instigator).toEqual(share.displayName);
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