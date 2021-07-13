import express from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import { RootEvent, onConnection } from "@/sockets";

/* EXPRESS SERVER */
const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/", (_req, res) => res.send("Hello world"));

/**
 * HTTP Server running the application
 */
const server = createServer(app);

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
