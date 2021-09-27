import { Router } from "express";
import { getBatch } from "./GetBatch";

const feedRouter = Router();

/* GET /feed?page=<page> */
feedRouter.get("/messages", getBatch);
feedRouter.get("/messages/:page", getBatch);

export default feedRouter;