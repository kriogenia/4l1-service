import { UserModel } from "@/models/User"

const getUserByGoogleId = async (id: string) : Promise<User> => {
	// Check if we already have the user
	return UserModel.findOne({ googleId: id })
		.then((result) => {
			if (result == null) {
				return result.get();
			} else {

			}
		})
		.catch((err: Error) => {
			throw err;
		});
	// if we do not, create a new user
	// return the user
}

const generateUser