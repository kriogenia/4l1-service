import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import { AddressInfo } from "net";
import { ioListener, SocketEvent } from "@/sockets";

describe("In the socket server", () => {
	
	let url: string;
	let server: Server;
	let clientA: Socket;
	let clientB: Socket;

	const room = {
		roomName: "room"
	};

	const dataA = {
		userName: "userA",
		...room
	};

	const dataB = {
		userName: "userB",
		...room
	}

	/**
	 * Creates the socket server and both clients to use
	 */
	beforeAll((done) => {
		const httpServer = createServer();
		/* Declares and configures the socket server */
		server = new Server(httpServer);
		server.on(SocketEvent.CONNECTION, ioListener(server));
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
		clientA.on(SocketEvent.CONNECT, () => {
			/* Once connected, connects clientB */
			clientB = Client(url, { forceNew: true });
			clientB.on(SocketEvent.CONNECT, done);
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

	describe("the 'suscribe' event", () => {

		it("should emit to the room the name of new suscriber", 
		(done) => {
			/* ClientA should receive its own userName as new suscriber */
			clientA.on(SocketEvent.NEW_SUSCRIBER, (arg) => {
				expect(arg).toBe(dataA.userName);
				done();
			});
			/* Emit the event */
			clientA.emit(SocketEvent.SUSCRIBE, JSON.stringify(dataA));
		});

	});
	
	describe("the 'send_location' event", () => {

		it("should broadcast the location to the rest of the room", 
		(done) => {
			const location = {
				x: 0,
				y: 1,
				...room
			}
			/* ClientB should receive clientA sent location */
			clientB.on(SocketEvent.UPDATE_LOCATION, (arg) => {
				expect(JSON.parse(arg)).toEqual(location);
				done();
			});
			/* Preparation to send the location once clientB is suscribed */
			clientB.on(SocketEvent.NEW_SUSCRIBER, (args) => {
				if (args === dataB.userName) {
					clientA.emit(SocketEvent.SEND_LOCATION, JSON.stringify(location));
				}
			});
			/* Client B subscribes to the room and starts the chain */
			clientB.emit(SocketEvent.SUSCRIBE, JSON.stringify(dataB));
		});

	});


});