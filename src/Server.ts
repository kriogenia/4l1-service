import { createServer } from "http";
import { Server } from "socket.io";
import { RootEvent, onConnection } from "@/sockets";
import { app } from "./App";
import { connectToMongo } from "./Mongo";

/* MONGODB CONNECTION */
connectToMongo();

const server = createServer(app);						// HTTP

/* SOCKET.IO SERVER */
const io = new Server(server);		// change to io.listen?
app.set("io", io);	// Stores io in express to access it anywhere

/* SOCKET.IO LISTENER */
io.on(RootEvent.CONNECTION, onConnection(io));

export { server }
