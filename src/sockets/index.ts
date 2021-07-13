import { Server, Socket } from "socket.io";
import { setLocationSockets } from "./location";

export enum RootEvent {
	CONNECT = "connect",
	CONNECTION = "connection",
	DISCONNECT = "disconnect"
}

export const onConnection = (io: Server) => (socket: Socket) => {
    console.log(`Connection : SocketId = ${socket.id}`);
	/* ROOT EVENTS */
	socket.on(RootEvent.DISCONNECT, onDisconnect(socket, io));
	/* LOCATION EVENTS */
    setLocationSockets(io, socket);
}

const onDisconnect = (_socket: Socket, _io: Server) => (_data: any) => {
	// Log operation <- if used middleware this could be erased
}