import { Router } from "express";
import { getBatch } from "./GetBatch";

const feedRouter = Router();

/* GET /feed/messages */
feedRouter.get("/messages", getBatch);
feedRouter.get("/messages/:page", getBatch);

export default feedRouter;