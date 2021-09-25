import { Server, Socket } from "socket.io";

export const onSubscribe = (_socket: Socket, _io: Server) => (_data: any) => {
	// Log operation
	// Check data integrity
	// Check that the user can suscribe to that room
	// If so, connect the socket to the room
	// Emit notification of the user joining the room
	// TODO
}