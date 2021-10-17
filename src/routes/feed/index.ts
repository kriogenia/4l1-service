import { Router } from "express";
import { getBatch } from "./GetBatch";
import notificationsRouter from "./notifications";

const feedRouter = Router();

/* GET /feed/messages?page=<page> */
feedRouter.get("/messages", getBatch);

/* /feed/notifications/ */
feedRouter.use("/notifications", notificationsRouter);

export default feedRouter;