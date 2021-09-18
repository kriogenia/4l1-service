import { Socket } from "socket.io";

/**
 * Retrieves the global room the socket is subscribed to
 * @param socket socket subscribed to the global room
 * @returns id of the global room
 */
export const getRoom = (type: string, socket: Socket): string => {
	return [...socket.rooms].filter((r) => r.includes(type))[0] ?? null;
};