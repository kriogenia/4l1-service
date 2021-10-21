import { Action, NotificationModel, Notification } from "@/models/Notification";
import { Role } from "@/models/User";
import { ERR_MSG } from "@/shared/errors";
import { DAY_IN_MILLIS } from "@/shared/values";
import * as UserService from "./UserService";

export const DEFAULT_MAX_AGE = 7; // 7 days

/**
 * Creates a new notification of the specified action filling it with the interested
 * users
 * @param action to notify
 * @param instigatorId id of the action instigator
 * @param tags tags to apply to the action
 * @returns the Notification created and returned from the database
 */
export const create = async (action: Action, instigatorId: string, tags: string[] = []):
Promise<Notification> => {
	return UserService.getById(instigatorId)
		.then(async (user) => {
			if (user.role === Role.Blank) {
				throw Error(ERR_MSG.only_keepers_cared);
			}

			const interested = user.role === Role.Patient ? user.bonds
				: (await UserService.getCared(instigatorId)).bonds;
			if (interested.length === 0) return null;
			
			if (user.role === Role.Keeper) {
				interested.remove(user._id);
				interested.push(user.cared);
			}
			
			return NotificationModel.create({
				action: action,
				instigator: user.displayName,
				timestamp: Date.now(),
				tags: tags,
				interested: interested
			});
		})
		.catch((e) => { throw e });
}

/**
 * Returns the list of unread notifications of an user with the specified age treshold.
 * The default max age is 7 days.
 * @param userId id of the user
 * @param maxAge max age in days of the notifications to retrieve
 * @returns the list of unread notifications
 */
export const getUnread = async (userId: string, maxAge: number = DEFAULT_MAX_AGE): 
Promise<Notification[]> => {
	return NotificationModel.find({
		timestamp: { $gte: Date.now() - maxAge * DAY_IN_MILLIS },
		interested: { $all: [ userId ] }
	});
}

/**
 * Sets the notifications of an user as read
 * @param userId id of the user reading the notification
 */
export const setAllRead = async (userId: string):
Promise<void> => {
	return NotificationModel.find({ interested: { $all: [ userId ] } })
		.then(async (notifications) => {
			await Promise.all(notifications.map((n) => n.removeInterested(userId)));
		})
		.catch((e) => { throw e; });
}

/**
 * Sets the specified notification as read by the specified user
 * @param notificationId id of the notification to set as read
 */
export const setReadByUser = async (notificationId: string, userId: string):
Promise<void> => {
	return NotificationModel.findById(notificationId)
		.then(async (notification) => {
			if (!notification) return;
			await notification.removeInterested(userId);
		})
		.catch((e) => { throw e; });
}

/**
 * Removes the current notification of a new task created
 * @param taskId id of the deleted task
 * @returns removed notification
 */
export const removeCreatedTask = async (taskId: string): 
Promise<Notification> => removeByActionAndTag(Action.TASK_CREATED, taskId);

/**
 * Removes the current notification of sharing location of the user
 * @param userId id of the notification user
 * @returns removed notification
 */
export const removeSharingLocation = async (userId: string): 
Promise<Notification> => removeByActionAndTag(Action.LOCATION_SHARING_START, userId);

/**
 * Removes a notification with an specified action and tag
 * @param action Action of the notification
 * @param tag Tag to identify the notification (should be unique)
 * @returns 
 */
const removeByActionAndTag = async (action: Action, tag: string): 
Promise<Notification> => {
	return NotificationModel.findOneAndRemove({
			action: action,
			tags: { $all: [tag] }
	});
};