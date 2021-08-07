import { AppAuthCredentials } from "@/interfaces";
import { Role, User, UserModel } from "@/models/User"

/**
 * Retrieves the user associated with the provided Google Id.
 * If there's no user, create a new one to return it.
 * @param credentials Google credentials of the user
 * @returns user account related to that id
 */
export const getUserByGoogleId = async (credentials: AppAuthCredentials) : Promise<User> => {
	// Check if we already have the user
	return new Promise((resolve, reject) => {
		UserModel.findOne({ googleId: credentials.id }).exec(
			(err, result) => {
				if (err) return reject(err);
				// return the user found or a new one if there's no user found
				resolve(result ?? generateUser(credentials))
			}
		);
	});
}

/**
 * Generates a new User from its Google credentials
 * @param credentials of the Google account of the user
 * @returns new User created with those credentials
 */
const generateUser = async (credentials: AppAuthCredentials) : Promise<User> => {
	const { givenName, familyName, id } = credentials;
	return await UserModel.create({
		givenName: givenName,
		familyName: familyName,
		googleId: id,
		role: Role.Blank
	});
}