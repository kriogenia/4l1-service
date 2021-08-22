import { getModelForClass, modelOptions, post, prop } from "@typegoose/typegoose";
import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import Logger from "jet-logger";

/**
 * List of possible types of user
 */
export enum Role {
	Keeper = "keeper",
	Patient = "patient",
	Blank = "blank"
}


/**
 * Post hook to log any new user creation
 */
@post<UserSchema>("save", (user) => {
	Logger.Info(`New User[${user.id as string ?? ""}] created with GoogleID[${user.googleId}] `)
})
/**
 * Entity of the application users
 * @property {string?} displayName name of the user to display in the app
 * @property {string} googleId of the account that user uses to authenticate
 * @property {Role} role type of user
 */
 @modelOptions({ schemaOptions: { collection: "users" } })
class UserSchema {

	@prop()
	public displayName?: string;

	@prop({ required: true, unique: true })
	public googleId: string;

	@prop({ required: true })
	public role: Role;

}

export type User = DocumentType<UserSchema, BeAnObject>;

/**
 * Model to manage User database operations
 */
export const UserModel = getModelForClass(UserSchema);