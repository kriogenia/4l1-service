import { LOG } from "@/shared/Logger";
import { Socket } from "socket.io";

/**
 * Generates a logging function to all the events received
 * @param socket 
 * @returns logging function
 */
export const logListener = (socket: Socket) => (name: string) => {
	LOG.info(`Event[${name}] - Socket: [${socket.id}]`);
}