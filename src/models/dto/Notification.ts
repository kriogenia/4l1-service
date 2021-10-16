import { Action } from "../Notification";

export interface NotificationDto {
	action: Action,
	instigator: string,
	timestamp: number
}