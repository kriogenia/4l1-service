/* istanbul ignore file */
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

<<<<<<< HEAD
export let mongoMock: MongoMemoryServer;
=======
let mongoMock: MongoMemoryServer;
>>>>>>> 9232e08... Test login endpoint

/**
 * Creates a connection to the local memory database
 */
export const connect = async () => {
	mongoMock = await MongoMemoryServer.create()
	const uri = mongoMock.getUri();
	await mongoose.connect(uri, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
}

/**
 * Disconnects from the local memory database
 */
export const close = async () => {
<<<<<<< HEAD
	await mongoose.connection.dropDatabase();
=======
	//await mongoose.connection.dropDatabase();
>>>>>>> 9232e08... Test login endpoint
	await mongoose.connection.close();
	await mongoMock.stop();
}

/**
 * Clears the whole local memory database
 */
export const clear = async () => {
<<<<<<< HEAD
	await mongoose.connection.dropDatabase();
	//const collections = mongoose.connection.collections;
	//for (const key in collections) {
	//	await collections[key].deleteMany({});
	//}
=======
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
>>>>>>> 9232e08... Test login endpoint
}