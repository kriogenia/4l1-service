import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";

/**
 * Entity of the application active sessions
 * @property {string} refresh token currently active
 * @property {string} auth token active with this refresh token
 * @property {number} expiration time of the refresh token
 */
 @modelOptions({ schemaOptions: { collection: "sessions" } })
export class SessionSchema {

	@prop({ required: true, unique: true })
	public refresh: string;

	@prop({ required: true })
	public auth: string;

	@prop({ required: true })
	public expiration: number;

}

/** Session object */
export type Session = DocumentType<SessionSchema, BeAnObject>;

/** Model to manage Session database operations */
export const SessionModel = getModelForClass(SessionSchema);