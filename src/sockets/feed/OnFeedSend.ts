import { Server, Socket } from "socket.io";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { FEED, FeedEvent } from ".";
import * as FeedService from "@/services/FeedService";
import { Message } from "@/models/Message";

/**
 * Event triggered when a user sends a message through the Feed Room.
 * It saves the message and sends it to the rest of users into
 * @param socket socket triggering the event
 * @param _io server
 * @param data message to broadcast
 */
export const onSend = (socket: Socket, io: Server) => async (data: Message): 
Promise<void> => {
	const room = getRoom(FEED, socket);
	if (!room) return;
	// save the message into the DB
	LOG.info(`User[${data.submitter.toString()}] sent a new message`);
	return FeedService.create({
		...data,
		room: room
	}).then((message) => {
		io.to(room).emit(FeedEvent.NEW, message);	// and communicate it through the feed room
	}).catch((error) => LOG.err(error));
}