import { Role, User, UserModel } from "@/models/User"
import { badRequestError, ERR_MSG } from "@/shared/errors";
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
 * Promise of user retrieve by its Id
 * @param userId of the user to get
 * @returns data of the user with the matching id
 */
export const getById = async (userId: string): Promise<User> => {
	return new Promise((resolve, reject) => {
		UserModel.findById(userId).exec(
			(err, result) => {
				if (err) return reject(err);
				resolve(result);
			}
		);
	});
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
 * Retrieves the data of the user cared by the specified user if it exists
 * @param userId Id of the user requesting the data
 * @returns data of the patient bond with the user
 * @throws a BAD_REQUEST error when the user is not a Keeper
 */
export const getCared = async (userId: string): Promise<User> => {
	return getById(userId)
			.then((user) => {
				if (user.role !== Role.Keeper) {
					throw Error(ERR_MSG.only_keepers_cared);
				}
				if (!user.cared) return null;	// If the user doesn't have cared, return null
				return getById(user.cared.toString());
			});
}

/**
 * Retrieves the Users bonded by a Patient
 * @param userId of the Patient
 * @returns the data of the Users bonded by the Patient
 * @throws a BAD_REQUEST error when the user is not a Patient
 */
export const getBonds = async (userId: string): Promise<User[]> => {
	return new Promise((resolve, reject) => {
		getById(userId)
			.then((user) => {
				if (user.role !== Role.Patient) {
					throw Error(ERR_MSG.only_patients_bond);
				}
				UserModel.find({ _id: { $in: user.bonds } }).exec(
					(err, result) => {
						if (err) return reject(err);
						resolve(result);
					}
				);
			})
			.catch(reject);
	});
}

/**
 * Retrieves the Users bonded by the Patient cared by a Keeper
 * @param userId of the Keeper
 * @returns the data of the Users caring for the same Patient as the requestor
 * @throws a BAD_REQUEST error when the user is not a Keeper is not bonded
 */
export const getBondsOfCared = async (userId: string): Promise<User[]> => {
	return getCared(userId)
			.then((cared) => {
				if (cared == null) {
					throw badRequestError(ERR_MSG.keeper_not_bonded)
				}
				return getBonds(cared._id);
			});
}

/**
 * Retrieves the role of the specified user
 * @param userId of the user to check
 * @returns the role of the user with the matching id
 */
export const getRole = async (userId: string): Promise<Role> => {
	return getById(userId).then((user) => user.role);
}

/**
 * Updates the persisted user with the provided information
 * @param user User to be updated with its new info
 * @returns update user
 */
export const update = async (user: Partial<User>): Promise<User> => {
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
