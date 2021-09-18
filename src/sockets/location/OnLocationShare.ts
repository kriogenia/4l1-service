import { Server, Socket } from "socket.io";
import { GlobalRoomEvent } from "../global";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";

export interface Message {
	id: string,
	displayName: string
}

/**
 * Event triggered when a user starts sharing their location.
 * It doest connect the user to the location sharing room and notifies the other user
 * throught the global room
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user sharing the location
 */
export const onLocationShare = (socket: Socket, _io: Server) => (data: Message): void => {
	const global = getRoom("global", socket);
	if (!global) {
		LOG.err("The user is not connected to a Global Room");
		socket.disconnect();
		return;
	}
	// subscribe to location sharing room
	const room = global.replace("global", "location");
	socket.join(room);
	LOG.info(`User[${data.id}] started sharing its location on Room[${room}]`);
	// and communicate it through the location and global room
	socket.broadcast.to(global).emit(GlobalRoomEvent.SHARING_LOCATION, data);
}
