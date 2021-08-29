import { getModelForClass, modelOptions, post, prop, Severity } from "@typegoose/typegoose";
import { BeAnObject, DocumentType, Ref } from "@typegoose/typegoose/lib/types";
import Logger from "jet-logger";

/** List of possible types of user */
export enum Role {
	Keeper = "keeper",
	Patient = "patient",
	Blank = "blank"
}

/** Simplified model representing an address with the needed info to allow personal 
 * localization of the user. */
interface Address {
	firstLine?: string,
	secondLine?: string,
	locality?: string,
	region?: string
}


/** Post hook to log any new user creation */
@post<UserSchema>("save", (user) => {
	Logger.Info(`New User[${user.id as string ?? ""}] created with GoogleID[${user.googleId}] `)
})

/**
 * Entity of the application users
 * @property {string} googleId of the account that user uses to authenticate
 * @property {Role} role type of user
 * @property {string?} displayName name of the user to display in the app
 * @property {string?} mainPhoneNumber main phone number to use as way of contact
 * @property {string?} altPhoneNumber alternative phone number to use as way of contact
 * @property {string?} email email address of the user
 */
 @modelOptions({ 
	schemaOptions: { collection: "users" },
	options: { allowMixed: Severity.ALLOW } 
})
class UserSchema {

	@prop({ required: true, unique: true })
	public googleId: string;

	@prop({ required: true })
	public role: Role;

	@prop()
	public displayName?: string;

	@prop()
	public mainPhoneNumber?: string;

	@prop()
	public altPhoneNumber?: string;

	@prop()
	public address?: Address;
	
	@prop()
	public email?: string;

	@prop({ ref: () => UserSchema })
	public bonds?: Ref<UserSchema>[];

}

export type User = DocumentType<UserSchema, BeAnObject>;

/**
 * Model to manage User database operations
 */
export const UserModel = getModelForClass(UserSchema);