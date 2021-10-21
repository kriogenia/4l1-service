import { GLOBAL, GlobalRoomEvent } from "@/sockets/global";
import { Output } from "@/sockets/global/OnGlobalSubscribe";
import * as UserService from "@/services/UserService";
import { mocked } from "ts-jest/utils";
import { Role, User } from "@/models/User";
import { SocketTestHelper } from "@test-util/SocketSetUp";
import { io } from "@server";

/** Needed mock for socket tests */
jest.mock("@server");
jest.mock("@/services/UserService");

//jest.setTimeout(10000);
describe("Subscribing to Global Room", () => {
	
	const s = new SocketTestHelper();

	const idClientA = "patient";
	const idClientB = "keeper";

	mocked(io);
	mocked(UserService.getById).mockImplementation((id: string) => {
		return Promise.resolve({
			_id: id, 
			role: id === idClientA ? Role.Patient : Role.Keeper,
			cared: idClientA as unknown
		} as User)
	});

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);


	describe("a patient", () => {

		it("should be connected to its room and receive the subscription message", 
		(done) => {
			/* ClientA should receive its own room and id in the subscription notification */
			s.clientA.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				expect(arg.user).toBe(idClientA);
				expect(arg.room).toEqual(`${GLOBAL}:${idClientA}`)
				done();
			});
			/* Emit the event */
			s.clientA.emit(GlobalRoomEvent.SUBSCRIBE, idClientA);
		});

	});

	describe("a keeper", () => {

		it("should be connected to its cared room and receive the subscription message", 
		(done) => {
			/* ClientA subscribes first */
			s.clientA.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				if (arg.user === idClientA) {
					s.clientB.emit(GlobalRoomEvent.SUBSCRIBE, idClientB);
				}
			});
			/* ClientB subscribes and should be connected A's room */
			s.clientB.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				expect(arg.user).toBe(idClientB);
				expect(arg.room).toEqual(`global:${idClientA}`);
				done();
			});
			/* Emit the event */
			s.clientA.emit(GlobalRoomEvent.SUBSCRIBE, idClientA);
		});

	});

});