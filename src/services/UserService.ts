import { Role, User, UserModel } from "@/models/User"

/**
 * Retrieves the user associated with the provided Google Id.
 * If there's no user, create a new one to return it.
 * @param userId unique Google Id of the user
 * @returns user account related to that id
 */
export const getUserByGoogleId = async (userId: string): Promise<User> => {
	// Check if we already have the user
	return new Promise((resolve, reject) => {
		UserModel.findOne({ googleId: userId }).exec(
			(err, result) => {
				if (err) return reject(err);
				// return the user found or a new one if there's no user found
				resolve(result ?? generateUser(userId))
			}
		);
	});
}

/**
 * Generates a new User from its Google credentials
 * @param userId of the Google account of the user
 * @returns new User created with those credentials
 */
const generateUser = async (userId: string): Promise<User> => {
	return await UserModel.create({
		googleId: userId,
		role: Role.Blank
	});
}