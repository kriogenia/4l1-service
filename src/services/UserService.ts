import { Role, User, UserModel } from "@/models/User"
import { LeanDocument } from "mongoose";

/**
 * Builds a bond between the users with the specified ids
 * @param patientId id of the patient
 * @param keeperId id of the keeper
 * @returns promise without return
 */
export const bond = async (patientId: string, keeperId: string): Promise<void> => {
	const patient = await UserModel.findById(patientId);
	const keeper = await UserModel.findById(keeperId);
	return patient.bondWith(keeper);
}

/**
 * Retrieves the user associated with the provided Google Id.
 * If there's no user, create a new one to return it.
 * @param userId unique Google Id of the user
 * @returns user account related to that id
 */
export const getByGoogleId = async (userId: string): Promise<User> => {
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
 * Updates the persisted user with the provided information
 * @param user User to be updated with its new info
 * @returns update user
 */
export const update = async (user: LeanDocument<User>): Promise<User> => {
	return new Promise((resolve, reject) => {
		UserModel.findByIdAndUpdate(user._id, user).exec(
			(err, result) => {
				if (err) return reject(err);
				resolve(result);
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