import { Server, Socket } from "socket.io";
import { LOCATION, LocationEvent } from ".";
import { getRoom } from "../SocketHelper";

export interface Data {
	id: string,
	displayName: string,
	position: {
		latitude: number,
		longitude: number
	}
}

/**
 * Event triggered when a user updates their location.
 * It broadcast the location to the rest of the room
 * @param socket socket triggering the event
 * @param _io server
 * @param data id, name and location of the user sharing the location
 */
export const onUpdate = (socket: Socket, _io: Server) => (data: Data): void => {
	const room = getRoom(LOCATION, socket);
	if (!room) return;
	// Share the location with the users connected to the same location room
	socket.broadcast.to(room).emit(LocationEvent.UPDATE, data);
}
