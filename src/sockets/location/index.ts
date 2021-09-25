import { Server, Socket } from "socket.io";
import { onShare } from "./OnLocationShare";
import { onStop } from "./OnLocationStop";
import { onUpdate } from "./OnLocationUpdate";

export const LOCATION = "location";

/**
 * Keys of the location events
 */
export enum LocationEvent {
	SHARE = "location:share",
	STOP = "location:stop",
	UPDATE = "location:update"
}

/**
 * Sets up the Location listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
export const setLocationListeners = (socket: Socket, io: Server) => {
	socket.on(LocationEvent.SHARE, onShare(socket, io));
	socket.on(LocationEvent.STOP, onStop(socket, io));
	socket.on(LocationEvent.UPDATE, onUpdate(socket, io));
}