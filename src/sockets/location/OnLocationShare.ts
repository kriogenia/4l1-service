import { Server, Socket } from "socket.io";
import { GLOBAL } from "../global";
import { LOG } from "@/shared/Logger";
import { getRoom } from "../SocketHelper";
import { LOCATION } from ".";
import { UserMinDto } from "@/models/dto";
import * as NotificationService from "@/services/NotificationService";
import { Action } from "@/models/Notification";

/**
 * Event triggered when a user starts sharing their location.
 * It doest connect the user to the location sharing room and notifies the other user
 * throught the global room
 * @param socket socket triggering the event
 * @param _io server
 * @param data id and name of the user sharing the location
 */
export const onShare = (socket: Socket, _io: Server) => async (data: UserMinDto): 
Promise<void> => {
	const global = getRoom(GLOBAL, socket);
	if (!global) {
		LOG.err("The user is not connected to a Global Room");
		socket.disconnect();
		return;
	}
	// subscribe to location sharing room
	const room = global.replace(GLOBAL, LOCATION);
	socket.join(room);
	LOG.info(`User[${data._id}] started sharing its location on Room[${room}]`);
	// and notify it
	const notification = await NotificationService.create(
		Action.LOCATION_SHARING_START, data._id, [data._id]);
	socket.broadcast.to(global).emit(notification.event, notification.dto());
}
