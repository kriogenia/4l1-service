import { Server, Socket } from "socket.io";
import { onLocationShare } from "./OnLocationShare";
import { onLocationUpdate } from "./OnLocationUpdate";

export const LOCATION = "location";

/**
 * Keys of the location events
 */
export enum LocationEvent {
	SHARE = "location:share",
	UPDATE = "location:update"
}

/**
 * Sets up the Location listeners
 * @param socket to poblate with listeners
 * @param io to use in the listeners
 */
export const setLocationListeners = (socket: Socket, io: Server) => {
	socket.on(LocationEvent.SHARE, onLocationShare(socket, io));
	socket.on(LocationEvent.UPDATE, onLocationUpdate(socket, io));
}