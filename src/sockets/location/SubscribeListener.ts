import { Server, Socket } from "socket.io";
import { LocationEvent } from "./";

export const onSubscribe = (socket: Socket, io: Server) => (data: string) => {
	// Log operation
	// Check data integrity
	// Check that the user can suscribe to that room
	// If so, connect the socket to the room
	// Emit notification of the user joining the room
	console.log("Called onSuscribe");
	const room_data = JSON.parse(data)
	const userName = room_data.userName;
	const roomName = room_data.roomName;

	socket.join(`${roomName}`)
	console.log(`User ${userName} joined Room ${roomName}`)
	
	io.to(`${roomName}`).emit(LocationEvent.SUBSCRIPTION, userName);
}