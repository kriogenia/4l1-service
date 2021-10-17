import { Action, NotificationModel, Notification } from "@/models/Notification";
import { Role } from "@/models/User";
import { ERR_MSG } from "@/shared/errors";
import * as UserService from "./UserService";

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
			const bonds = user.role === Role.Patient ? user.bonds
				: (await UserService.getCared(instigatorId)).bonds;
			return NotificationModel.create({
				action: action,
				instigator: user.displayName,
				timestamp: Date.now(),
				tags: tags,
				interested: [ user, ...bonds ]
			});
		})
		.catch((e) => { throw e });
}

/**
 * Removes the current notification of sharing location of the user
 * @param userId id of the notification user
 * @returns removed notification
 */
export const removeSharingLocation = async (userId: string): 
Promise<Notification> => {
	return NotificationModel.findOneAndRemove({
			action: Action.LOCATION_SHARING_START,
			tags: { $all: [userId] }
	});
};