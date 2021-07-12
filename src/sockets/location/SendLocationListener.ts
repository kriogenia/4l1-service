import { Server, Socket } from "socket.io";
import { SocketEvent } from "@/sockets";

const onSendLocation = (socket: Socket, _io: Server) => (data: any) => {
	// Log operation <- middleware?
	// Check data integrity
	// Broadcast locatio
	const obj = JSON.parse(data);
	console.log(`Location sent - Socket:[${socket.id}]`);
	console.log({obj});
	socket.broadcast.to(`${obj.roomName}`).emit(SocketEvent.UPDATE_LOCATION, JSON.stringify(obj))
}

export { onSendLocation }