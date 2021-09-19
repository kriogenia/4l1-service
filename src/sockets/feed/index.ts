import { Server, Socket } from "socket.io";
import { onJoin } from "./OnFeedJoin";

export const FEED = "feed";

/**
 * Keys of the Feed events
 */
export enum FeedEvent {
	JOIN = "feed:join",
	JOINED = "feed:join"
}

/**
 * Sets up the Feed listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
export const setFeedListeners = (socket: Socket, io: Server) => {
    socket.on(FeedEvent.JOIN, onJoin(socket, io));
}