import { Server, Socket } from "socket.io";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { FEED, FeedEvent } from ".";
import * as FeedService from "@/services/FeedService";
import { MessageType } from "@/models/Message";
import { UserInfo } from "../schemas";

export interface Input {
	message: string,
	user: UserInfo,
	timestamp: number
}

export interface Output extends Input {
	_id: string
}

/**
 * Event triggered when a user sends a message through the Feed Room.
 * It saves the message and sends it to the rest of users into
 * @param socket socket triggering the event
 * @param _io server
 * @param data message to broadcast
 */
export const onSend = (socket: Socket, io: Server) => async (data: Input): 
Promise<void> => {
	const room = getRoom(FEED, socket);
	if (!room) return;
	// save the message into the DB
	LOG.info(`User[${data.user._id}] sent "${data.message}"`);
	return FeedService.create({
		message: data.message,
		user: data.user._id,
		timestamp: data.timestamp,
		type: MessageType.Text
	}).then((message) => {
		const output: Output = {_id: message._id,...data};
		io.to(room).emit(FeedEvent.NEW, output);	// and communicate it through the feed room
	}).catch((error) => LOG.err(error));
}