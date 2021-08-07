import { getModelForClass, prop } from "@typegoose/typegoose";

class User {

	@prop()
	public givenName: string;

	@prop()
	public familyName?: string;

	@prop({ required: true })
	public googleId: string;

	@prop({ required: true })
	public role: Role;
}

enum Role {
	Keeper = "keeper",
	Patient = "patient",
	Blank = "blank"
}

export const UserModel = getModelForClass(User);