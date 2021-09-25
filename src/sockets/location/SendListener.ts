import { Server, Socket } from "socket.io";
import { LocationEvent } from ".";

export const onSend = (socket: Socket, _io: Server) => (data: any) => {
	// Log operation <- middleware?
	// Check data integrity
	// Broadcast locatio
	const obj = JSON.parse(data);
	console.log(`Location sent - Socket:[${socket.id}]`);
	console.log({obj});
	socket.broadcast.to(`${obj.roomName}`).emit(LocationEvent.UPDATE, JSON.stringify(obj))
}