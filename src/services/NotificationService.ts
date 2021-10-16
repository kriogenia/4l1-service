import { Action, NotificationModel, Notification } from "@/models/Notification";
import { Role } from "@/models/User";
import { ERR_MSG } from "@/shared/errors";
import * as UserService from "./UserService";

/**
 * Creates a new notification of the specified action filling it with the interested
 * users
 * @param action to notify
 * @param instigatorId id of the action instigator
 * @param subject subject of the aciton if it exists
 * @returns the Notification created and returned from the database
 */
export const create = async (action: Action, instigatorId: string, subject: string = null):
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
				subject: subject,
				interested: [ user, ...bonds ]
			});
		})
		.catch((e) => { throw e });
}