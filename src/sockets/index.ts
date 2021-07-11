import { Socket } from "socket.io";
import { io } from "../Server";
import { onSuscribe, onSendLocation, onUnsuscribe, onDisconnect } from "./location";

const ioListener = (socket: Socket) => {
    console.log(`Connection : SocketId = ${socket.id}`)
    
    socket.on('subscribe', onSuscribe(socket, io));
    socket.on('shareLocation', onSendLocation(socket, io));
	socket.on("unsuscribe", onUnsuscribe(socket, io));
    socket.on('disconnect', onDisconnect(socket, io));

}

export { ioListener }