import { Server, Socket } from "socket.io";
import { onSend } from "./SendListener";
import { onSubscribe } from "./SubscribeListener";
import { onUnsubscribe } from "./UnsuscribeListener";

export enum LocationEvent {
	SEND = "location:send",
	SUBSCRIBE = "location:subscribe",
	SUBSCRIPTION = "location:subscription",
	UNSUBSCRIBE = "location:unsubscribe",
	UNSUBSCRIPTION = "location:unsuscruption",
	UPDATE = "location:update"
}

export const setLocationSockets = (io: Server, socket: Socket) => {
    socket.on(LocationEvent.SEND, onSend(socket, io));
    socket.on(LocationEvent.SUBSCRIBE, onSubscribe(socket, io));
	socket.on(LocationEvent.UNSUBSCRIBE, onUnsubscribe(socket, io));
}