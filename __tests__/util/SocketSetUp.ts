import { onConnection, RootEvent } from "@/sockets";
import { createServer } from "http";
import { io as Client, Socket } from "socket.io-client";
import { Server } from "socket.io";
import { AddressInfo } from "net";

export class SocketTestHelper {

	private url: string;
	private server: Server;
	
	clientA: Socket;
	clientB: Socket;

	/**
	 * Creates the server to test the sockets
	 * @param callback test suite function to save the server
	 */
	setUpServer = (done: jest.DoneCallback) => {
		const httpServer = createServer();
		/* Declares and configures the socket server */
		this.server = new Server(httpServer);
		this.server.on(RootEvent.CONNECTION, onConnection(this.server));
		/* Starts the server and saves the url */
		httpServer.listen(() => {
			this.url = `http://localhost:${(httpServer.address() as AddressInfo).port}`;
			done();
		});
	};

	/**
	 * Creates the clients to test the sockets
	 * @param callback test suite function to save the clients
	 */
	setUpClients = (done: jest.DoneCallback) => {
		/* Connects clientA */
		this.clientA = Client(this.url, { forceNew: true });
		this.clientA.on(RootEvent.CONNECT, () => {
			/* Once connected, connects clientB */
			this.clientB = Client(this.url, { forceNew: true });
			this.clientB.on(RootEvent.CONNECT, done);
		});
	};

	/**
	 * Disconnects the clients sockets 
	 */
	disconnectClients = () => {
		this.clientA.disconnect();
		this.clientB.disconnect();
	}

	/**
	 * Closes the servers and clients
	 */
	close = () => {
		this.server.close();
		this.clientA.close();
		this.clientB.close();
	}

}


