import { getModelForClass, modelOptions, post, prop } from "@typegoose/typegoose";
import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import Logger from "jet-logger";
import { createTrue } from "typescript";

/**
 * Post hook to log any new session creation
 */
@post<SessionSchema>("save", (session) => {
	Logger.Info(`New Session[${session.id as string ?? ""}] created with RefreshToken[${session.refresh}] `)
})
/**
 * Entity of the application active sessions
 * @property {string} refresh token currently active
 * @property {string} auth token active with this refresh token
 * @property {number} expiration time of the refresh token
 */
 @modelOptions({ schemaOptions: { collection: "sessions" } })
class SessionSchema {

	@prop({ required: true, unique: true })
	public refresh: string;

	@prop({ required: true })
	public auth: string;

	@prop({ required: true })
	public expiration: number;

}

export type Session = DocumentType<SessionSchema, BeAnObject>;

/**
 * Model to manage Session database operations
 */
export const SessionModel = getModelForClass(SessionSchema);