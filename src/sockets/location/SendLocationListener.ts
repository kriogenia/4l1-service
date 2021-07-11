import { Server, Socket } from "socket.io";
import { SocketEvent } from "@sockets";

const onSendLocation = (socket: Socket, _io: Server) => (data: any) => {
	// Log operation <- middleware?
	// Check data integrity
	// Broadcast location
	console.log(`Location sent - Socket:[${socket.id}]`);
	console.log({data});
	socket.broadcast.to(`${data.roomName}`).emit(SocketEvent.UPDATE_LOCATION, JSON.stringify(data))
}

export { onSendLocation }