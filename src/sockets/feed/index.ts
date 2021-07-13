import { Server, Socket } from "socket.io";
import { onSubscribe } from "./SubscribeListener";

export enum FeedEvent {
	SUBSCRIBE = "feed:subscribe"
}

export const setFeedSockets = (io: Server, socket: Socket) => {
    socket.on(FeedEvent.SUBSCRIBE, onSubscribe(socket, io));
}