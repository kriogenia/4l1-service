import { getModelForClass, post, prop } from "@typegoose/typegoose";
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
	Logger.Info(`New User[${user._id as string ?? ""}] created with GoogleID[${user.googleId}] `)
})
/**
 * Entity of the application users
 * @property {string?} givenName of the user
 * @property {string?} familyName of the user
 * @property {string} googleId of the account that user used to authenticate
 * @property {Role} role type of user
 */
class UserSchema {

	@prop()
	public givenName: string;

	@prop()
	public familyName?: string;

	@prop({ required: true })
	public googleId: string;

	@prop({ required: true })
	public role: Role;

}

export type User = DocumentType<UserSchema, BeAnObject>;

/**
 * Model to manage User database operations
 */
export const UserModel = getModelForClass(UserSchema);