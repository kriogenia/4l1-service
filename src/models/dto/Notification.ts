import { Action } from "../Notification";

export interface NotificationDto {
	_id: string,
	action: Action,
	instigator: string,
	timestamp: number,
	tags?: string[]
}