import { getDiscriminatorModelForClass, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { BeAnObject, DocumentType, Ref } from "@typegoose/typegoose/lib/types";
import { TaskDto } from "./dto/Message";
import { UserSchema } from "./User";

/** List of possible types of messages */
export enum MessageType {
	Task = "task",
	Text = "text"
}

/**
 * Entity of the feed messages
 * @property {UserSchema} submitter author of the message
 * @property {string} username submitter display name
 * @property {number} timestamp creation timestamp
 * @property {number} lastUpdate timestamp of the last update
 * @property {string} room id of the room where it was sent
 * @property {Type} type type of the message
 */
@modelOptions({ schemaOptions: { collection: "messages" } })
export class MessageSchema {

	@prop({ required: true, ref: () => UserSchema })
	public submitter!: Ref<UserSchema>;

	@prop({ required: true })	// Cached
	public username!: string;

	@prop({ required: true })
	public timestamp!: number;

	@prop({ required: true })
	public lastUpdate!: number;

	@prop({ required: true, select: false })
	public room!: string;

	@prop({ required: true })
	public type!: MessageType

}

/**
 * Specific entity of the text messages
 * 
 * @property {string} message content of the message
 */
class TextMessageSchema extends MessageSchema {

	@prop({ required: true })
	public message!: string;

}

/**
 * Specific entity of the task messages
 * 
 * @property {string} title title of the task
 * @property {string} description task description
 * @property {boolean} done completion state
 */
class TaskMessageSchema extends MessageSchema {

	@prop({ required: true })
	public title!: string;
	
	@prop()
	public description?: string;
	
	@prop({ required: true })
	public done!: boolean;

	public dto(this: DocumentType<TaskMessageSchema>): TaskDto {
		return {
			_id: this._id,
			title: this.title,
			description: this.description,
			done: this.done,
			timestamp: this.timestamp,
			lastUpdate: this.lastUpdate,
			submitter: {
				_id: this.submitter.toString(),
				displayName: this.username
			},
			type: this.type
		}
	}

}

/** Message objects */
export type Message = Partial<BaseMessage | TextMessage | TaskMessage>;
type BaseMessage = DocumentType<MessageSchema, BeAnObject>;
export type TextMessage = DocumentType<TextMessageSchema, BeAnObject>;
export type TaskMessage = DocumentType<TaskMessageSchema, BeAnObject>;

/** Models to manage Feed database operations */
export const FeedModel = getModelForClass(MessageSchema);
export const TextMessageModel = getDiscriminatorModelForClass(FeedModel, TextMessageSchema);
export const TaskMessageModel = getDiscriminatorModelForClass(FeedModel, TaskMessageSchema);