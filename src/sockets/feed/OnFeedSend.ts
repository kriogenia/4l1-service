import { Server, Socket } from "socket.io";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { FEED, FeedEvent } from ".";
import * as FeedService from "@/services/FeedService";
import { MessageType } from "@/models/Message";

export interface Data {
	message: string,
	user: {
		id: string,
		displayName: string
	},
	timestamp: number
}

/**
 * Event triggered when a user sends a message through the Feed Room.
 * It saves the message and sends it to the rest of users into
 * @param socket socket triggering the event
 * @param _io server
 * @param data message to broadcast
 */
export const onSend = (socket: Socket, _io: Server) => (data: Data): 
Promise<void> => {
	const room = getRoom(FEED, socket);
	if (!room) return;
	// save the message into the DB
	FeedService.create({
		message: data.message,
		user: data.user.id,
		timestamp: data.timestamp,
		type: MessageType.Text
	})
	// and communicate it through the feed room
	socket.broadcast.to(room).emit(FeedEvent.SEND, data);
	LOG.info(`User[${data.user.id}] sent "${data.message}"`);
}