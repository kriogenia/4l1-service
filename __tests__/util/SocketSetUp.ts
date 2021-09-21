/* istanbul ignore file */
import { onConnection, RootEvent } from "@/sockets";
import { createServer } from "http";
import { io as Client, Socket } from "socket.io-client";
import { Server } from "socket.io";
import { AddressInfo } from "net";
import { GlobalRoomEvent } from "@/sockets/global";
import { Input } from "@/sockets/global/OnGlobalSubscribe";
import { LocationEvent } from "@/sockets/location";
import { UserInfo } from "@/sockets/schemas";

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

	/**
	 * Connect the clients to the same Global Room and executes
	 * the rest of the test
	 * @param callback 	rest of the test
	 */
	joinGlobal = (callback: () => void) => {
		const subscription: Input = {
			id: "patient",
			owner: "patient"
		};
	
		let doOnce = true;
		this.clientA.on(GlobalRoomEvent.SUBSCRIPTION, () => {
			if (doOnce) {
				doOnce = false;
				this.clientB.emit(GlobalRoomEvent.SUBSCRIBE, subscription);
			}
		});
		this.clientB.on(GlobalRoomEvent.SUBSCRIPTION, () => {
			callback();
		});
		this.clientA.emit(GlobalRoomEvent.SUBSCRIBE, subscription);
	}

	/**
	 * Connect the clients to the same Location Room and executes
	 * the rest of the test
	 * @param callback 	rest of the test
	 */
	joinLocation = (callback: () => void) => {
		const share: UserInfo = {
			_id: "keeper",
			displayName: "KEEPER"
		}
		
		this.joinGlobal(() => {
			this.clientB.on(GlobalRoomEvent.SHARING_LOCATION, () => {
				this.clientB.emit(LocationEvent.SHARE, share);
			});
			this.clientA.on(GlobalRoomEvent.SHARING_LOCATION, () => {
				callback();
			});
			this.clientA.emit(LocationEvent.SHARE, share);
		});
	};

}


