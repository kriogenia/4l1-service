import { createServer } from "http";
import { Server } from "socket.io";
import { RootEvent, onConnection } from "@/sockets";
import { app } from "./App";
import { connectToMongo } from "./Mongo";

/* MONGODB CONNECTION */
connectToMongo();

const server = createServer(app);						// HTTP

/* SOCKET.IO SERVER */
const io = new Server(server);

/* SOCKET.IO LISTENER */
io.on(RootEvent.CONNECTION, onConnection(io));

export { server, io }
