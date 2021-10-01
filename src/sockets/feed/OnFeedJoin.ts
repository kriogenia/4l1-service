import { Server, Socket } from "socket.io";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { FEED, FeedEvent } from ".";
import { GLOBAL, GlobalRoomEvent } from "../global";
import { UserMinDto } from "@/models/dto";

/**
 * Event triggered when a user joins a Feed Room.
 * It connects the user to the feed room and notifies the other users on it
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user sharing the location
 */
export const onJoin = (socket: Socket, _io: Server) => (data: UserMinDto): void => {
	const global = getRoom(GLOBAL, socket);
	if (!global) {
		LOG.err("The user is not connected to a Global Room");
		socket.disconnect();
		return;
	}
	// join the feed room
	const room = global.replace(GLOBAL, FEED);
	socket.join(room);
	LOG.info(`User[${data._id}] joined a feed on Room[${room}]`);
	// and communicate it through the feed room	(an global to allow testing)
	socket.broadcast.to(room).emit(FeedEvent.JOIN, data);
	socket.broadcast.to(global).emit(GlobalRoomEvent.JOINING_FEED, data);
}