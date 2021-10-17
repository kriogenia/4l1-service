import { UserMinDto } from "@/models/dto";
import { Action, NOTIFY } from "@/models/Notification";
import * as NotificationService from "@/services/NotificationService";
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

	const notification = await NotificationService.removeSharingLocation(data._id);
	if (!notification) return;
	socket.broadcast.to(getRoom(GLOBAL, socket)).emit(
		`${NOTIFY}:${Action.LOCATION_SHARING_STOP}`, notification.dto()
	);
}
