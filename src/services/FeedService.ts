import { FeedModel, Message, MessageType } from "@/models/Message"

export interface MessageData {
	message: string,
	user: string,
	timestamp: number,
	type: MessageType,
	room: string
}

export const create = async (message: MessageData):
Promise<Message> => await FeedModel.create({ ...message });