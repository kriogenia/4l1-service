import { LOG } from "@/shared/Logger";
import { SubscriptionRequest, SubscriptionNotification } from "@/interfaces";
import { Server, Socket } from "socket.io";
import { LocationEvent } from "./";

export const onSubscribe = (socket: Socket, io: Server) => (data: SubscriptionRequest) => {
	const { user_name, room_code } = data;
	socket.join(`${room_code}`);
	LOG.info(`User[${user_name}] joined Room[${room_code}] through Socket[${socket.id}] `);
	const notification: SubscriptionNotification = {
		user_name: user_name,
		timestamp: Date.now()
	}
	io.to(`${room_code}`).emit(LocationEvent.SUBSCRIPTION, notification);
}