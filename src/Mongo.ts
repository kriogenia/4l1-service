import mongoose from "mongoose";
import { LOG } from "./shared/Logger";

export const connectToMongo = () => {

	mongoose.connect(process.env.MONGO_URL)
	.then(() => {
		LOG.imp("Connected to MongoDB database");
	})
	.catch((e: Error) => {
		LOG.err(e);
	});

};

export const objectId = (id: string) => new mongoose.Types.ObjectId(id);