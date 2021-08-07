import { createServer } from "http";
import { Server } from "socket.io";
import { RootEvent, onConnection } from "@/sockets";
import { app } from "./App";
<<<<<<< HEAD
import { connectToMongo } from "./Mongo";
=======
import { connectToMongo } from "./MongoClient";
>>>>>>> dd9a615... Improve package distribution

/* MONGODB CONNECTION */
connectToMongo();

<<<<<<< HEAD
=======
/**
 * HTTP Server running the application
const credentials = {
	key: fs.readFileSync("key.pem"),
   cert: fs.readFileSync("cert.pem")
};
*/

>>>>>>> dd9a615... Improve package distribution
const server = createServer(app);						// HTTP
//const server = createServer(credentials, app);		// HTTPS

/* SOCKET.IO SERVER */
const io = new Server(server);		// change to io.listen?
app.set("io", io);	// Stores io in express to access it anywhere

/* SOCKET.IO LISTENER */
io.on(RootEvent.CONNECTION, onConnection(io));

export { server }
