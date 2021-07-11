import { Server, Socket } from "socket.io";
import { onSuscribe, onSendLocation, onUnsuscribe, onDisconnect } from "./location";
import { SocketEvent } from "./SocketEvent";

const  { DISCONNECT, SEND_LOCATION, SUSCRIBE, UNSUSCRIBE } = SocketEvent;

const ioListener = (io: Server) => (socket: Socket) => {
    console.log(`Connection : SocketId = ${socket.id}`)
    // Define the events and their listeners
    socket.on(DISCONNECT, onDisconnect(socket, io));
    socket.on(SEND_LOCATION, onSendLocation(socket, io));
    socket.on(SUSCRIBE, onSuscribe(socket, io));
	socket.on(UNSUSCRIBE, onUnsuscribe(socket, io));
}

export { ioListener, SocketEvent }