import { Server, Socket } from "socket.io";
import { ISocketSetUp } from "..";
import { onSend } from "./SendListener";
import { onSubscribe } from "./SubscribeListener";
import { onUnsubscribe } from "./UnsuscribeListener";

/**
 * Keys of the location events
 */
export enum LocationEvent {
	SEND = "location:send",
	SUBSCRIBE = "location:subscribe",
	SUBSCRIPTION = "location:subscription",
	UNSUBSCRIBE = "location:unsubscribe",
	UNSUBSCRIPTION = "location:unsuscruption",
	UPDATE = "location:update"
}

/**
 * Sets up the Location listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
export const setLocationSockets: ISocketSetUp = (socket: Socket, io: Server) => {
    socket.on(LocationEvent.SEND, onSend(socket, io));
    socket.on(LocationEvent.SUBSCRIBE, onSubscribe(socket, io));
	socket.on(LocationEvent.UNSUBSCRIBE, onUnsubscribe(socket, io));
}