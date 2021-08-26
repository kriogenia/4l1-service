import { Router } from "express";
import authRouter from "./auth";
import { validateToken } from "./middlewares";
import userRouter from "./user";

const baseRouter = Router();

// Testing endpoint
baseRouter.get("/", (_req, res) => res.send("Hello world"));

/************ PUBLIC ENDPOINTS ************/

/* /auth */
baseRouter.use("/auth", authRouter);

/*********** PRIVATE ENDPOINTS ***********/

/* /user */
baseRouter.use("/user", validateToken, userRouter);

/****************************************/

export default baseRouter;