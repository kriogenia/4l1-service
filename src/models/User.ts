import { badRequestError, ERR_MSG } from "@/shared/errors";
import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { BeAnObject, DocumentType, Ref } from "@typegoose/typegoose/lib/types";
import { UserDto, UserPublicDto } from "./dto";

/** List of possible types of user */
export enum Role {
	Keeper = "keeper",
	Patient = "patient",
	Blank = "blank"
}

/** 
 * Simplified model representing an address with the needed info to allow personal 
 * localization of the user. 
 * */
export interface Address {
	firstLine?: string,
	secondLine?: string,
	locality?: string,
	region?: string
}

/**
 * Entity of the application users
 * @property {string} googleId of the account that user uses to authenticate
 * @property {Role} role type of user
 * @property {string?} displayName name of the user to display in the app
 * @property {string?} mainPhoneNumber main phone number to use as way of contact
 * @property {string?} altPhoneNumber alternative phone number to use as way of contact
 * @property {string?} email email address of the user
 * @property {User[]?} bonds list of keepers of the patient
 * @property {User?} kept bonded patient of the keeper
 */
 @modelOptions({ 
	schemaOptions: { collection: "users" },
	options: { allowMixed: Severity.ALLOW } 
})
export class UserSchema {

	@prop({ required: true, unique: true, select: false })
	public googleId?: string;

	@prop({ required: true, enum: Role })
	public role!: Role;

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

	@prop({ ref: () => UserSchema })
	public cared?: Ref<UserSchema>;

	public dto(this: DocumentType<UserSchema>): UserDto {
		return {
			_id: this._id,
			...this.public,
		}
	}

	public get public(): UserPublicDto {
		return {
			role: this.role,
			displayName: this.displayName,
			mainPhoneNumber: this.mainPhoneNumber,
			altPhoneNumber: this.altPhoneNumber,
			address: this.address,
			email: this.email
		}
	}

	/**
	 * Builds a bond between the specified patient and keeper if the requisites
	 * are covered
	 * @param patient 	patient to be bonded
	 * @param keeper	keeper to be bonded
	 */
	public async bondWith(this: DocumentType<UserSchema>, keeper: DocumentType<UserSchema>)
	: Promise<void> {
		if (this.role !== Role.Patient || keeper.role !== Role.Keeper) {
			throw Error("Invalid bond. The correct bond is PATIENT bonds with KEEPER");
		}
		if (this.bonds.length >= parseInt(process.env.MAX_BONDS)) {
			throw badRequestError(ERR_MSG.maximum_bonds_reached);
		}
		if (keeper.cared !== undefined) {
			throw badRequestError(ERR_MSG.keeper_already_bonded);
		}
		this.bonds.push(keeper);
		keeper.cared = this;
		await Promise.all([this.save(), keeper.save()]);
	}

}

/** User object */
export type User = DocumentType<UserSchema, BeAnObject>;

/** Model to manage User database operations */
export const UserModel = getModelForClass(UserSchema);
