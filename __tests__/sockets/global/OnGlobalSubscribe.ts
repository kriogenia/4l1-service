import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import { AddressInfo } from "net";
import { onConnection, RootEvent } from "@/sockets";
import { GlobalRoomEvent } from "@/sockets/global";
import { Input, Output } from "@/sockets/global/OnGlobalSubscribe";
import * as UserService from "@/services/UserService";
import { mocked } from "ts-jest/utils";
import { User } from "@/models/User";

/** Session service mock */
jest.mock("@/services/UserService");

//jest.setTimeout(10000);
describe("Subscribing to Global Room", () => {
	
	let url: string;
	let server: Server;
	let clientA: Socket;
	let clientB: Socket;

	const dataA: Input = {
		id: "patient",
		owner: "patient"
	};

	const dataB: Input = {
		id: "keeper",
		owner: "patient"
	};

	/**
	 * Creates the socket server and both clients to use
	 */
	beforeAll((done) => {
		const httpServer = createServer();
		/* Declares and configures the socket server */
		server = new Server(httpServer);
		server.on(RootEvent.CONNECTION, onConnection(server));
		/* Starts the server and saves the url */
		httpServer.listen(() => {
			url = `http://localhost:${(httpServer.address() as AddressInfo).port}`;
			done();
		});
	});

	/**
	 * Connects both clients
	 */
	beforeEach((done) => {
		/* Connects clientA */
		clientA = Client(url, { forceNew: true });
		clientA.on(RootEvent.CONNECT, () => {
			/* Once connected, connects clientB */
			clientB = Client(url, { forceNew: true });
			clientB.on(RootEvent.CONNECT, done);
		});
	});

	/**
	 * Closes the server and both sockets
	 */
	afterAll(() => {
		server.close();
		clientA.close();
		clientB.close();
	});

	/**
	 * Disconnects both sockets
	 */
	afterEach(() => {
		clientA.disconnect();
		clientB.disconnect();
	});

	describe("a patient", () => {

		it("should be connected to its room and receive the subscription message", 
		(done) => {
			/* ClientA should receive its own room and id in the subscription notification */
			clientA.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				expect(arg.user).toBe(dataA.id);
				expect(arg.room).toEqual(`global:${dataA.id}`)
				done();
			});
			/* Emit the event */
			clientA.emit(GlobalRoomEvent.SUBSCRIBE, dataA);
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
			clientA.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				if (arg.user === dataA.id) {
					clientB.emit(GlobalRoomEvent.SUBSCRIBE, dataB);
				}
			});
			/* ClientB subscribes and should be connected A's room */
			clientB.on(GlobalRoomEvent.SUBSCRIPTION, (arg: Output) => {
				expect(arg.user).toBe(dataB.id);
				expect(arg.room).toEqual(`global:${dataA.id}`)
				done();
			});
			/* Emit the event */
			clientA.emit(GlobalRoomEvent.SUBSCRIBE, dataA);
		});

		// TODO Test with error

	});

});