
import { createServer } from "http";
//import { createServer } from "https";
import fs from "fs";
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
const io = new Server(server, {
	maxHttpBufferSize: 1e4,
	connectTimeout: 5000,
	transports:['websocket','polling'],
	pingInterval: 25 * 1000,
	pingTimeout: 5000,
	allowEIO3: true,
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	}
});
app.set("io", io);	// Stores io in express to access it anywhere

/* SOCKET.IO LISTENER */
io.on(RootEvent.CONNECTION, onConnection(io));

export { server }
