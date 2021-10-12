import { FeedModel, Message, MessageType, TaskMessageModel, TextMessageModel } from "@/models/Message"

export const DEFAULT_PAGE = 1;
export const DEFAULT_BATCH_SIZE = 25;

/** Minimum info to create new Messages */

/**
 * Creates a new message with the specified info
 * @param message message to create
 * @returns the Message created and returned from the database
 */
export const create = async (message: Message):
Promise<Message> => {
	return ((message.type === MessageType.Text) 
		? TextMessageModel.create(message) 
		: TaskMessageModel.create(message));
}

/**
 * Returns a batch of messages from the specified room.
 * The default size is 25.
 * @param room room of the messages to return
 * @param page the page of messages to retrieve (from 1 to n/size)
 * @param size size of the batch to retrieve
 * @returns specified list of messages
 */
export const getBatch = async(room: string, page = DEFAULT_PAGE, size = DEFAULT_BATCH_SIZE):
Promise<Message[]> => {
	page = Math.max(DEFAULT_PAGE, page);
	return new Promise((resolve, reject) => {
		FeedModel.find({ room: room })
			.sort({ timestamp: "desc" })	// retrieve the more recent messages
			.limit(size)
			.skip((page - 1) * size)
			.exec((err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
	});
}