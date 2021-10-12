/* istanbul ignore file */
import { onConnection, RootEvent } from "@/sockets";
import { createServer } from "http";
import { io as Client, Socket } from "socket.io-client";
import { Server } from "socket.io";
import { AddressInfo } from "net";
import { GlobalRoomEvent } from "@/sockets/global";
import { LocationEvent } from "@/sockets/location";
import * as UserService from "@/services/UserService";
import { mocked } from "ts-jest/utils";
import { Role, User } from "@/models/User";
import { FeedEvent } from "@/sockets/feed";
import { UserMinDto } from "@/models/dto";

export class SocketTestHelper {

	private url: string;
	private server: Server;
	
	clientA: Socket;
	clientB: Socket;

	idClientA = "patient";
	idClientB = "keeper";

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

		mocked(UserService.getById).mockImplementation((id: string) => {
			return Promise.resolve({
				_id: id, 
				role: id === this.idClientA ? Role.Patient : Role.Keeper,
				cared: this.idClientA as unknown
			} as User)
		});
	
		let doOnce = true;
		this.clientA.on(GlobalRoomEvent.SUBSCRIPTION, () => {
			if (doOnce) {
				doOnce = false;
				this.clientB.emit(GlobalRoomEvent.SUBSCRIBE, this.idClientB);
			}
		});
		this.clientB.on(GlobalRoomEvent.SUBSCRIPTION, () => {
			callback();
		});
		this.clientA.emit(GlobalRoomEvent.SUBSCRIBE, this.idClientA);
	}

	/**
	 * Connect the clients to the same Location Room and executes
	 * the rest of the test
	 * @param callback 	rest of the test
	 */
	joinLocation = (callback: () => void) => {
		const share: UserMinDto = {
			_id: this.idClientA,
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

	/**
	 * Connect the clients to the same Feed Room and executes
	 * the rest of the test
	 * @param callback 	rest of the test
	 */
	joinFeed = (callback: () => void) => {
		const share: UserMinDto = {
			_id: this.idClientA,
			displayName: "KEEPER"
		}
		this.joinGlobal(() => {
			this.clientB.on(GlobalRoomEvent.JOINING_FEED, () => {
				this.clientB.emit(FeedEvent.JOIN, share);
			});
			this.clientA.on(GlobalRoomEvent.JOINING_FEED, () => {
				callback();
			});
			this.clientA.emit(FeedEvent.JOIN, share);
		});
	};

}


