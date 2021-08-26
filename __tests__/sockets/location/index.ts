import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import { AddressInfo } from "net";
import { onConnection, RootEvent } from "@/sockets";
import { LocationEvent } from "@/sockets/location";
import { SubscriptionNotification, SubscriptionRequest } from "@/interfaces";

//jest.setTimeout(10000);
describe("Calling location:", () => {
	
	let url: string;
	let server: Server;
	let clientA: Socket;
	let clientB: Socket;

	const room = {
		room_code: "room"
	};

	const dataA: SubscriptionRequest = {
		user_name: "userA",
		...room
	};
/*
	const dataB: SubscriptionRequest = {
		user_name: "userB",
		...room
	}
*/
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

	describe("subscribe event", () => {

		it("should emit to the room the name of new subscriber", 
		(done) => {
			const start = Date.now();
			/* ClientA should receive its own userName as new suscriber */
			clientA.on(LocationEvent.SUBSCRIPTION, (arg: SubscriptionNotification) => {
				expect(arg.user_name).toBe(dataA.user_name);
				expect(arg.timestamp).toBeGreaterThan(start);
				expect(arg.timestamp).toBeLessThan(Date.now());
				done();
			});
			/* Emit the event */
			clientA.emit(LocationEvent.SUBSCRIBE, dataA);
		});

	});
	
	// describe("send event", () => {

	// 	it("should broadcast the location to the rest of the room", 
	// 	(done) => {
	// 		const location = {
	// 			x: 0,
	// 			y: 1,
	// 			...room
	// 		}
	// 		/* ClientB should receive clientA sent location */
	// 		clientB.on(LocationEvent.UPDATE, (arg) => {
	// 			expect(JSON.parse(arg)).toEqual(location);
	// 			done();
	// 		});
	// 		/* Preparation to send the location once clientB is suscribed */
	// 		clientB.on(LocationEvent.SUBSCRIPTION, (args) => {
	// 			if (args === dataB.user_name) {
	// 				clientA.emit(LocationEvent.SEND, JSON.stringify(location));
	// 			}
	// 		});
	// 		/* Client B subscribes to the room and starts the chain */
	// 		clientB.emit(LocationEvent.SUBSCRIBE, JSON.stringify(dataB));
	// 	});

	// });


});