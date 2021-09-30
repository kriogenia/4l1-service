import { getDiscriminatorModelForClass, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { BeAnObject, DocumentType, Ref } from "@typegoose/typegoose/lib/types";
import { UserSchema } from "./User";

/** List of possible types of messages */
export enum MessageType {
	Task = "task",
	Text = "text"
}

/**
 * Entity of the feed messages
 * @property {string} message content of the message
 * @property {UserSchema} submitter author of the message
 * @property {number} timestamp creation timestamp
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
	public room!: string;

	@prop({ required: true })
	public type!: MessageType

}

class TextMessageSchema extends MessageSchema {

	@prop({ required: true })
	public message!: string;

}

class TaskMessageSchema extends MessageSchema {

	@prop({ required: true })
	public title!: string;
	
	@prop()
	public description: string;
	
	@prop({ required: true })
	public done!: boolean;

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