import { LOG } from "@/shared/Logger";
import { Server, Socket } from "socket.io";
import { setFeedSockets } from "./feed";
import { setLocationSockets } from "./location";
import { logListener } from "./Middlewares";

/**
 * Sets up the socket with listeners
 */
export interface ISocketSetUp {
	(socket: Socket, io: Server): void
}

/**
 * Keys of the root events
 */
export enum RootEvent {
	CONNECT = "connect",
	CONNECTION = "connection",
	DISCONNECT = "disconnect"
}

/**
 * Generates the function that serves as a "connection" listener
 * for the given {@link Socket}, setting up all the listeners when called
 * @param io {@link Server} to propagate
 * @returns "connection" event listener
 */
export const onConnection = (io: Server) => (socket: Socket) => {
    LOG.info(`Connection : SocketId = ${socket.id}`);
	/* PRE-ACTION MIDDLEWARES */
	socket.onAny(logListener(socket));
	/* ROOT EVENTS */
	socket.on(RootEvent.DISCONNECT, onDisconnect(socket));
	/* LOCATION EVENTS */
    setLocationSockets(socket, io);
	setFeedSockets(socket, io);
}

/**
 * Handles the socket disconnection
 * @param socket 
 * @returns listener to "disconnection" events
 */
const onDisconnect = (socket: Socket) => () => {
	LOG.info(`Disconnection : SocketId = ${socket.id}`);
}