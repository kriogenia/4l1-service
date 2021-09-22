import { Role } from "@/models/User";
import * as UserService from "@/services/UserService";
import { LOG } from "@/shared/Logger";
import { Server, Socket } from "socket.io";
import { GLOBAL, GlobalRoomEvent } from ".";

export interface Output {
	user: string,
	room: string
}

/**
 * Joins the sockets to its respective global room 
 * @param socket socket triggering the event
 * @param _io server
 * @param data id of the user connecting
 */
export const onSubscribe = (socket: Socket, io: Server) => async (data: string)
: Promise<void> => {
	const user = await UserService.getById(data);
	if (user.role === Role.Blank || (user.role === Role.Keeper && !user.cared)) return;

	const roomId = `${GLOBAL}:${(user.role === Role.Patient) ? data : user.cared.toString()}`;
	socket.join(roomId);
	LOG.info(`User[${data}] joined Room[${roomId}] through Socket[${socket.id}] `);

	const message: Output = {
		user: data,
		room: roomId
	};
	io.to(roomId).emit(GlobalRoomEvent.SUBSCRIPTION, message);
}
