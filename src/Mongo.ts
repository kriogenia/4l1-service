import Logger from "jet-logger";
import mongoose from "mongoose";

export const connectToMongo = () => {

	mongoose.connect(process.env.MONGO_URL, {
		useCreateIndex: true,
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
