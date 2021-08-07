import Logger from "jet-logger";
import { Server, Socket } from "socket.io";
import { LocationEvent } from ".";

export const onSend = (socket: Socket, _io: Server) => (data: any) => {
	// Log operation <- middleware?
	// Check data integrity
	// Broadcast locatio
	const obj = JSON.parse(data);
	Logger.Info(`Location sent - Socket:[${socket.id}]`);
	socket.broadcast.to(`${obj.roomName}`).emit(LocationEvent.UPDATE, JSON.stringify(obj))
}