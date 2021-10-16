import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { BeAnObject, DocumentType, Ref } from "@typegoose/typegoose/lib/types";
import { NotificationDto } from "./dto";
import { TaskMessageSchema } from "./Message";
import { UserSchema } from "./User";

export enum Action {
	BOND_CREATED = "bond_created",
	BOND_DELETED = "bond_deleted",
	TASK_CREATED = "task_created",
	TASK_DELETED = "task_deleted",
	TASK_DONE = "task_done",
	TASK_UNDONE = "task_undone",
	LOCATION_SHARING_START = "location_sharing_start",
	LOCATION_SHARING_END = "location_sharing_end"
}

/**
 * Entity of the user notifications
 * @property {Action} action to notify
 * @property {string} instigator display name of the notification perpretator
 * @property {number} timestamp creation timestamp of the notification
 * @property {User[]} interested users to notify with the notification
 * @property {TaskMessage} subject entity of the notification
 */
 @modelOptions({ schemaOptions: { collection: "notifications" } })
export class NotificationSchema {

	@prop({ required: true })
	public action!: Action;

	@prop({ required: true })
	public instigator!: string;

	@prop({ required: true })
	public timestamp!: number;

	@prop()
	public subject?: string;

	@prop({ ref: () => UserSchema })
	public interested!: Ref<UserSchema>[];

	public dto(this: DocumentType<NotificationSchema>): NotificationDto {
		return {
			action: this.action,
			instigator: this.instigator,
			timestamp: this.timestamp
		}
	}

}

/** Session object */
export type Notification = DocumentType<NotificationSchema, BeAnObject>;

/** Model to manage Session database operations */
export const NotificationModel = getModelForClass(NotificationSchema);