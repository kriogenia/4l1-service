import { Router } from "express";
import authRouter from "./auth";

const baseRouter = Router();

// Testing endpoint
baseRouter.get("/", (_req, res) => res.send("Hello world"));

/* /auth */
baseRouter.use("/auth", authRouter);

export default baseRouter;