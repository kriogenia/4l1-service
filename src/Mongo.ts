import Logger from "jet-logger";
import mongoose from "mongoose";

export const connectToMongo = () => {

	mongoose.connect(process.env.MONGO_URL, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		Logger.Imp("Connected to MongoDB database");
	})
	.catch((e: Error) => {
		Logger.Err(e);
	});

};

export const objectId = (id: string) => new mongoose.Types.ObjectId(id);