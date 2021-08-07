
import { createServer } from "http";
//import { createServer } from "https";
//import fs from "fs";
import { Server } from "socket.io";
import { RootEvent, onConnection } from "@/sockets";
import { app } from "./App";
import { connectToMongo } from "./MongoClient";

/* MONGODB CONNECTION */
connectToMongo();

/**
 * HTTP Server running the application
const credentials = {
	key: fs.readFileSync("key.pem"),
   cert: fs.readFileSync("cert.pem")
};
*/

const server = createServer(app);						// HTTP
//const server = createServer(credentials, app);		// HTTPS

/* SOCKET.IO SERVER */
const io = new Server(server);		// change to io.listen?
app.set("io", io);	// Stores io in express to access it anywhere

/* SOCKET.IO LISTENER */
io.on(RootEvent.CONNECTION, onConnection(io));

export { server }
