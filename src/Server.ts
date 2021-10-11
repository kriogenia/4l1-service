
import { createServer } from "http";
import { Server } from "socket.io";
import { RootEvent, onConnection } from "@/sockets";
import { app } from "./App";

/**
 * HTTP Server running the application
 */
const server = createServer(app);

/* SOCKET.IO SERVER */
const io = new Server(server);		// change to io.listen?
app.set("io", io);	// Stores io in express to access it anywhere

/* SOCKET.IO LISTENER */
io.on(RootEvent.CONNECTION, onConnection(io));

export { server }
