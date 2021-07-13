import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import { Environment } from "./shared/constants";

/**
 * Express server to manage all the routing
 */
const app = express();

if (process.env.NODE_ENV === Environment.DEV) {
    app.use(morgan("dev"));
}

if (process.env.NODE_ENV === Environment.PROD) {
    app.use(helmet());
}

app.get("/", (_req, res) => res.send("Hello world"));

export { app }