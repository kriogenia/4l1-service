import { Server, Socket } from "socket.io";

const onSendLocation = (socket: Socket, _io: Server) => (data: any) => {
	// Log operation <- middleware?
	// Check data integrity
	// Broadcast location
	console.log(`Location sent - Socket:[${socket.id}]`);
	console.log({data});
	socket.broadcast.to(`${data.roomName}`).emit("updateLocation",JSON.stringify(data))
}

export { onSendLocation }