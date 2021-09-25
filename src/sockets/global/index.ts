import { Server, Socket } from "socket.io";
import { onSubscribe } from "./OnGlobalSubscribe";

export const GLOBAL = "global"

/**
 * Keys of the global room events
 */
export enum GlobalRoomEvent {
	JOINING_FEED = "global:joining_feed",
	SHARING_LOCATION = "global:sharing_location",
	SUBSCRIBE = "global:subscribe",
	SUBSCRIPTION = "global:subscription"
}

/**
 * Sets up the Global Room listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
 export const setGlobalListeners = (socket: Socket, io: Server) => {
    socket.on(GlobalRoomEvent.SUBSCRIBE, onSubscribe(socket, io));
}