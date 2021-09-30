/* istanbul ignore file */	// Set up file, untestable
import { Router } from "express";
import authRouter from "./auth";
import feedRouter from "./feed";
import { validateToken } from "./middlewares";
import taskRouter from "./task";
import userRouter from "./user";

const baseRouter = Router();

// Testing endpoint
baseRouter.get("/", (_req, res) => res.send("Hello world"));

/************ PUBLIC ENDPOINTS ************/

/* /auth */
baseRouter.use("/auth", authRouter);

/*********** PRIVATE ENDPOINTS ***********/

/* /feed */
baseRouter.use("/feed", validateToken, feedRouter);

/* /task */
baseRouter.use("/tasks", /*validateToken,*/ taskRouter);

/* /user */
baseRouter.use("/user", validateToken, userRouter);

/****************************************/

export default baseRouter;