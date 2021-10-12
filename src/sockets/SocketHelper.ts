import { Socket } from "socket.io";
import * as UserService from "@/services/UserService";
import { Role } from "@/models/User";
import { badRequestError, ERR_MSG } from "@/shared/errors";
import { FEED } from "./feed";

/**
 * Retrieves the current room the socket is subscribed to of the specified type
 * @param socket socket subscribed to the global room
 * @returns id of the global room
 */
export const getRoom = (type: string, socket: Socket): string => {
	return [...socket.rooms].filter((r) => r.includes(type))[0] ?? null;
};

/**
 * Retrieves the user associated Feed Room based on its data
 * @param id if of the user
 * @returns id of the feed room
 */
export const getFeedRoom = async (id: string): Promise<string> => {
	return UserService.getById(id)
		.then((user) => {
			if (user.role === Role.Blank) throw badRequestError(ERR_MSG.invalid_role);
			if (user.role === Role.Keeper && !user.cared) throw badRequestError(ERR_MSG.keeper_not_bonded);
			return `${FEED}:${(user.role === Role.Patient) ? id : user.cared.toString()}`
		})
		.catch(e => { throw e; });
}