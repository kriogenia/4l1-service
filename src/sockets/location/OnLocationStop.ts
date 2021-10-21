import { UserMinDto } from "@/models/dto";
import { Action } from "@/models/Notification";
import * as NotificationService from "@/services/NotificationService";
import { LOG } from "@/shared/Logger";
import { Server, Socket } from "socket.io";
import { LOCATION, LocationEvent } from ".";
import { GLOBAL } from "../global";
import { getRoom } from "../SocketHelper";

/**
 * Event triggered when a user leaves the location room.
 * Removes the user from the room and notifies it to the rest of the room.
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user leaving
 */
export const onStop = (socket: Socket, io: Server) => async (data: UserMinDto): 
Promise<void> => {
	const room = getRoom(LOCATION, socket);
	if (!room) return;
	
	socket.leave(room);
	io.to(room).emit(LocationEvent.STOP, data);

	return NotificationService.removeSharingLocation(data._id)
		.then((notification) => {
			if (!notification) return;
			notification.action = Action.LOCATION_SHARING_STOP;
			socket.broadcast.to(getRoom(GLOBAL, socket)).emit(notification.event, notification.dto());
		})
		.catch((e) => { LOG.err(e) });
}
