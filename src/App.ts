import express, { json } from "express";
import morgan from "morgan";
import helmet from "helmet";
import baseRouter from "@/routes";
import { Environment } from "@/shared/constants";

/*********** CREATE THE EXPRESS APPLICATION ***********/
const app = express();

/************** PRE-ROUTING MIDDLEWARES **************/

if (process.env.NODE_ENV === Environment.DEV) {
	/* Logs all the incoming requests */
    app.use(morgan("dev"));
}

if (process.env.NODE_ENV === Environment.PROD) {
	/* Sets security headers */
    app.use(helmet());
}

/* Parses the body JSONs */
app.use(json())

/**************** SET THE BASE ROUTER ****************/
app.use(baseRouter);

/************** EXPORT THE APPLICATION ***************/
export { app }