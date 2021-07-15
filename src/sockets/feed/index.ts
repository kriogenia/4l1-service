import { Server, Socket } from "socket.io";
import { onSubscribe } from "./SubscribeListener";

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
export const setFeedSockets = (socket: Socket, io: Server) => {
    socket.on(FeedEvent.SUBSCRIBE, onSubscribe(socket, io));
}