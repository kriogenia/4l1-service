import { Server, Socket } from "socket.io";

const onDisconnect = (_socket: Socket, _io: Server) => (_data: any) => {
	// Log operation <- if used middleware this could be erased
}

export { onDisconnect }