import { RootEvent } from "@/sockets";
import { GlobalRoomEvent } from "@/sockets/global";
import { Input, Output } from "@/sockets/global/OnGlobalSubscribe";
import * as UserService from "@/services/UserService";
import { mocked } from "ts-jest/utils";
import { User } from "@/models/User";
import { SocketTestHelper } from "@test-util/SocketSetUp";

/** Session service mock */
jest.mock("@/services/UserService");

//jest.setTimeout(10000);
describe("Subscribing to Global Room", () => {
	
	const s = new SocketTestHelper();

	const dataA: Input = {
		id: "patient",
		owner: "patient"
	};

	const dataB: Input = {
		id: "keeper",
		owner: "patient"
	};

	beforeAll(s.setUpServer);

	beforeEach(s.setUpClients);

	afterAll(s.close);

	afterEach(s.disconnectClients);

	describe("a patient", () => {

		it("should be connected to its room and receive the subscription message", 
		(done) => {
			/* ClientA should receive its own room and id in the subscription notification */
			s.clientA.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				expect(arg.user).toBe(dataA.id);
				expect(arg.room).toEqual(`global:${dataA.id}`)
				done();
			});
			/* Emit the event */
			s.clientA.emit(GlobalRoomEvent.SUBSCRIBE, dataA);
		});

	});

	describe("a keeper", () => {
		
		const mockGetCared = mocked(UserService.getCared);

		it("should be connected to its cared room and receive the subscription message", 
		(done) => {
			mockGetCared.mockImplementation((_userId: string) => {
				return Promise.resolve({ id: "patient" } as User)
			});
			/* ClientA subscribes first */
			s.clientA.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				if (arg.user === dataA.id) {
					s.clientB.emit(GlobalRoomEvent.SUBSCRIBE, dataB);
				}
			});
			/* ClientB subscribes and should be connected A's room */
			s.clientB.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				expect(arg.user).toBe(dataB.id);
				expect(arg.room).toEqual(`global:${dataA.id}`);
				done();
			});
			/* Emit the event */
			s.clientA.emit(GlobalRoomEvent.SUBSCRIBE, dataA);
		});

		it("should be disconnected if the passed owner is not it's cared user",
		(done) => {
			mockGetCared.mockImplementation((_userId: string) => {
				return Promise.resolve({ id: "invalid" } as User)
			});
			/* ClientB should be disconnected */
			s.clientB.on(RootEvent.DISCONNECT, () => {
				done();
			});
			s.clientB.emit(GlobalRoomEvent.SUBSCRIBE, dataB);
		});

	});

});