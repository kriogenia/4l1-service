import * as UserService from "@/services/UserService";
import { ERR_MSG } from "@/shared/errors";
import { LOG } from "@/shared/Logger";
import { Server, Socket } from "socket.io";
import { GlobalRoomEvent } from ".";

export interface Input {
	id: string,
	owner: string
}

export interface Output {
	user: string,
	room: string
}

export const onSubscribe = (socket: Socket, io: Server) => async (data: Input)
: Promise<void> => {
	const { id, owner } = data;
	const roomId = `global:${owner}`;
	
	if (id !== owner) {
		const cared = (await UserService.getCared(id)).id;
		if (cared !== owner) {
			LOG.err(`User[${id}] requested invalid access to the global room of User[${owner}]`)
			socket.disconnect();
			return;
		}
	}

	socket.join(roomId);
	LOG.info(`User[${id}] joined Room[${roomId}] through Socket[${socket.id}] `);

	const message: Output = {
		user: id,
		room: roomId
	};
	io.to(roomId).emit(GlobalRoomEvent.SUBSCRIPTION, message);
}
