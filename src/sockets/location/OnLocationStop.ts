import { UserMinDto } from "@/models/dto";
import { Server, Socket } from "socket.io";
import { LOCATION, LocationEvent } from ".";
import { getRoom } from "../SocketHelper";

/**
 * Event triggered when a user leaves the location room.
 * Removes the user from the room and notifies it to the rest of the room.
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user leaving
 */
export const onStop = (socket: Socket, io: Server) => (data: UserMinDto): void => {
	const room = getRoom(LOCATION, socket);
	if (!room) return;
	
	socket.leave(room);
	io.to(room).emit(LocationEvent.STOP, data);
}
