import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
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
 * @property {UserSchema} user author of the message
 * @property {number} timestamp creation timestamp
 * @property {Type} type type of the message
 */
@modelOptions({ schemaOptions: { collection: "messages" } })
export class MessageSchema {

	@prop({ required: true })
	public message: string;

	@prop({ required: true,ref: () => UserSchema })
	public user: Ref<UserSchema>;

	@prop({ required: true })
	public timestamp: number;

	@prop({ required: true })
	public type: MessageType;

	@prop({ required: true })
	public room: string;

}

/* Message object */
export type Message = DocumentType<MessageSchema, BeAnObject>;

/** Model to manage Feed database operations */
export const FeedModel = getModelForClass(MessageSchema);