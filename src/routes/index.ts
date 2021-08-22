import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";

const baseRouter = Router();

// Testing endpoint
baseRouter.get("/", (_req, res) => res.send("Hello world"));

/************ PUBLIC ENDPOINTS ************/

/* /auth */
baseRouter.use("/auth", authRouter);

/*********** PRIVATE ENDPOINTS ***********/

const privateRouter = Router();

// privateRouter.use(validateToken);
// privateRouter.use(getSessionId);

/* /user */
privateRouter.use("/user", userRouter);

baseRouter.use(privateRouter);

/****************************************/

export default baseRouter;