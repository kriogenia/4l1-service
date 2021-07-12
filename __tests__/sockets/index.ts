import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket } from "socket.io-client";
import { AddressInfo } from "net";
import { ioListener, SocketEvent } from "@/sockets";

describe("The socket server", () => {
	
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
		server = new Server(httpServer);
		httpServer.listen(() => {
			const url = `http://localhost:${(httpServer.address() as AddressInfo).port}`;
			clientA = Client(url);
			clientB = Client(url);
			server.on(SocketEvent.CONNECTION, ioListener(server));
			clientA.on(SocketEvent.CONNECT, done);
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

	afterEach(() => {
		clientA.disconnect();
		clientB.disconnect();
	});

	describe("the 'suscribe' event", () => {

		it("should emit to the room the new suscriber when called", 
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


});