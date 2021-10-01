import { Server, Socket } from "socket.io";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { FEED, FeedEvent } from ".";
import * as FeedService from "@/services/FeedService";
import { MessageType } from "@/models/Message";
import { UserSchema } from "@/models/User";
import { Ref } from "@typegoose/typegoose";
import { UserMinDto } from "@/models/dto";
import { objectId } from "@/Mongo";

export interface Input {
	message: string,
	submitter: UserMinDto,
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
	LOG.info(`User[${data.submitter._id}] sent "${data.message}"`);
	return FeedService.create({
		message: data.message,
		submitter: objectId(data.submitter._id),
		username: data.submitter.displayName,
		timestamp: data.timestamp,
		type: MessageType.Text,
		room: room
	}).then((message) => {
		const output: Output = {_id: message._id,...data};
		io.to(room).emit(FeedEvent.NEW, output);	// and communicate it through the feed room
	}).catch((error) => LOG.err(error));
}