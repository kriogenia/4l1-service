import { Server, Socket } from "socket.io";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { FEED, FeedEvent } from ".";
import { UserMinDto } from "@/models/dto";

/**
 * Event triggered when a user leaves a Feed Room.
 * It disconnects the user from the feed room and notifies the other users on it
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user sharing the location
 */
export const onLeave = (socket: Socket, _io: Server) => (data: UserMinDto): void => {
	const room = getRoom(FEED, socket);
	if (!room) return;
	// leave the feed room
	socket.leave(room);
	LOG.info(`User[${data._id}] left the on Room[${room}]`);
	// and communicate it through the feed room
	socket.broadcast.to(room).emit(FeedEvent.LEAVE, data);
}