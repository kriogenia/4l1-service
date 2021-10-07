import { Message, MessageType, TaskMessage, TaskMessageModel } from "@/models/Message"

export const DEFAULT_MAX_AGE = 3 * 24 * 60 * 60 * 1000 // 3 days

/**
 * Creates a task with the specified info
 * @param task tasl to create
 * @returns the TaskMessage created and returned from the database
 */
export const create = async (task: Message):
Promise<TaskMessage> => {
	return TaskMessageModel.create({
		...task,
		type: MessageType.Task
	});
}

/**
 * Retrieves all the tasks that are either yet to be completed or created in the
 * span of days from the specified maxAge
 * @param room room of the tasks to retrieve
 * @param maxAge maximum number of days of existance of the task
 * @returns list of relevant tasks
 */
export const getRelevant = async (room: string, maxAge: number = DEFAULT_MAX_AGE):
Promise<TaskMessage[]> => {
	maxAge = maxAge ?? DEFAULT_MAX_AGE;
	return new Promise((resolve, reject) => {
		return TaskMessageModel.find({ room: room }).or([
			{ done: false }, 
			{ timestamp: { $gte: Date.now() - maxAge } }
		]).exec((err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
}