import { Server, Socket } from "socket.io";
import { onJoin } from "./OnFeedJoin";
import { onLeave } from "./OnFeedLeave";
import { onSend } from "./OnFeedSend";

export const FEED = "feed";

/**
 * Keys of the Feed events
 */

export enum FeedEvent {
	DELETE = "feed:delete",
	LEAVE = "feed:leave",
	NEW = "feed:new",
	JOIN = "feed:join",
	SEND = "feed:send",
	TASK_STATE_UPDATE = "feed:task_state_update"
}

/**
 * Sets up the Feed listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
export const setFeedListeners = (socket: Socket, io: Server) => {
	socket.on(FeedEvent.LEAVE, onLeave(socket, io));
    socket.on(FeedEvent.JOIN, onJoin(socket, io));
	socket.on(FeedEvent.SEND, onSend(socket, io));
}