import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const mongoMock = new MongoMemoryServer();

/**
 * Creates a connection to the local memory database
 */
export const connectToDb = async () => {
	const uri = mongoMock.getUri();
	await mongoose.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
}

/**
 * Disconnects from the local memory database
 */
export const closeDb = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongoMock.stop();
}

/**
 * Clears the whole local memory database
 */
export const clearDb = async () => {
	const collections = mongoose.connection.collections
	for (const key in collections) {
		await collections[key].deleteMany({});
	}
}