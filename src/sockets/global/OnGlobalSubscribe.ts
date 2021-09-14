import * as UserService from "@/services/UserService";
import { ERR_MSG } from "@/shared/errors";
import { LOG } from "@/shared/Logger";
import { Server, Socket } from "socket.io";
import { GlobalRoomEvent } from ".";

interface Input {
	id: string,
	owner: string
}

interface Output {
	message: string,
	user: string
}

export const onSubscribe = (socket: Socket, io: Server) => async (data: Input)
: Promise<void> => {
	const { id, owner } = data;
	const roomId = `global:${owner}`;
	
	if (id !== owner) {
		const cared = (await UserService.getCared(id)).id;
		if (cared !== owner) {
			throw new Error(ERR_MSG.invalid_room_subscription);
		}
	}

	socket.join(roomId);
	LOG.info(`User[${id}] joined Room[${roomId}] through Socket[${socket.id}] `);

	const message: Output = {
		message: "New user has joined the room",
		user: id
	};
	io.to(roomId).emit(GlobalRoomEvent.SUBSCRIPTION, message);
}
