import * as UserService from "@/services/UserService";
import { LOG } from "@/shared/Logger";
import { msg_room_subscription } from "@/shared/strings";
import { Server, Socket } from "socket.io";
import { GlobalRoomEvent } from "../global";
import { globalRoom } from "..";

interface Input {
	id: string,
	displayName: string
}

interface Output {
	message: string,
	id: string,
	displayName: string
}

export const onLocationShare = (socket: Socket, _io: Server) => (data: Input): void => {
	const output: Output = {
		message: msg_room_subscription,
		...data
	}

	// subscribe to sharing room - first coordinates?
	socket.broadcast.to(globalRoom(socket)).emit(GlobalRoomEvent.SHARING_LOCATION, output);
}
