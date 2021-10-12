import { UserMinDto } from ".";
import { MessageType } from "../Message";

export interface TaskMinDto {
	title: string,
	description?: string
	submitter: UserMinDto,
	done: boolean,
	timestamp: number,
	lastUpdate: number
}

export interface TaskDto extends TaskMinDto {
	_id: string,
	type: MessageType
}