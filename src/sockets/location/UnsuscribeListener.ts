import { Server, Socket } from "socket.io";
import { SocketEvent } from "@/sockets";

const onUnsuscribe = (socket: Socket, io: Server) => (data: any) => {
	// Log operation
	// Check data integrity
	// Disconnect the socket from the room
	// Emit notification of the user leaving the room
	console.log("Called onSuscribe");
	const room_data = JSON.parse(data)
	const userName = room_data.userName;
	const roomName = room_data.roomName;

	socket.leave(`${roomName}`)
	console.log(`User ${userName} leaved Room ${roomName}`)
	
	io.to(`${roomName}`).emit(SocketEvent.NEW_UNSUSCRIBER, userName);
}

export { onUnsuscribe }