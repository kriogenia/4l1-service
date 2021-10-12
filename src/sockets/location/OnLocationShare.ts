import { Server, Socket } from "socket.io";
import { GLOBAL, GlobalRoomEvent } from "../global";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { LOCATION } from ".";
import { UserMinDto } from "@/models/dto";

/**
 * Event triggered when a user starts sharing their location.
 * It doest connect the user to the location sharing room and notifies the other user
 * throught the global room
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user sharing the location
 */
export const onShare = (socket: Socket, _io: Server) => (data: UserMinDto): void => {
	const global = getRoom(GLOBAL, socket);
	if (!global) {
		LOG.err("The user is not connected to a Global Room");
		socket.disconnect();
		return;
	}
	// subscribe to location sharing room
	const room = global.replace(GLOBAL, LOCATION);
	socket.join(room);
	LOG.info(`User[${data._id}] started sharing its location on Room[${room}]`);
	// and communicate it through the global room
	socket.broadcast.to(global).emit(GlobalRoomEvent.SHARING_LOCATION, data);
}
