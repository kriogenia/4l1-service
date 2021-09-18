import { Server, Socket } from "socket.io";

/**
 * Keys of the Feed events
 */
export enum FeedEvent {
	SUBSCRIBE = "feed:subscribe"
}

/**
 * Sets up the Feed listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
export const setFeedListeners = (_socket: Socket, _io: Server) => {
    //socket.on(FeedEvent.SUBSCRIBE, onSubscribe(socket, io));
}