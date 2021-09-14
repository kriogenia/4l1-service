import { LOG } from "@/shared/Logger";
import { Server, Socket } from "socket.io";
import { setFeedListeners } from "./feed";
import { setGlobalListeners } from "./global";
import { setLocationListeners } from "./location";
import { logListener } from "./Middlewares";
export { globalRoom } from "./SocketHelper";

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
    LOG.info(`Connection - Socket: [${socket.id}]`);
	/* PRE-ACTION MIDDLEWARES */
	socket.prependAny(logListener(socket));
	/* ROOT EVENTS */
	socket.on(RootEvent.DISCONNECT, onDisconnect(socket));
	/* ROOM EVENTS */
	setGlobalListeners(socket, io);
    setLocationListeners(socket, io);
	setFeedListeners(socket, io);
}

/**
 * Handles the socket disconnection
 * @param socket 
 * @returns listener to "disconnection" events
 */
const onDisconnect = (socket: Socket) => () => {
	LOG.info(`Disconnection - Socket: [${socket.id}]`);
}