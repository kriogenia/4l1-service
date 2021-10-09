import { Message, MessageType, TaskMessage, TaskMessageModel } from "@/models/Message"
import { DAY_IN_MILLIS } from "@/shared/values";

export const DEFAULT_MAX_AGE = 3; // 3 days

/**
 * Creates a task with the specified info
 * @param task task to create
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
 * Removes a task with the specified Id
 * @param id of the task
 */
 export const remove = async (id: string):
 Promise<TaskMessage> => {
	return new Promise((resolve, reject) => {
		TaskMessageModel.findByIdAndRemove(id).exec(
			(err, result) => {
				if (err) return reject(err);
				resolve(result);
			}
		);
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
			{ timestamp: { $gte: Date.now() - maxAge * DAY_IN_MILLIS } }
		]).exec((err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
}

/**
 * Updates the persisted task with the provided information
 * @param task Task to be updated with its new info
 * @returns update task
 */
 export const update = async (task: Partial<TaskMessage>): Promise<TaskMessage> => {
	return new Promise((resolve, reject) => {
		TaskMessageModel.findByIdAndUpdate(task._id, task, { new: true }).exec(
			(err, result) => {
				if (err) return reject(err);
				resolve(result);
			}
		);
	});
}