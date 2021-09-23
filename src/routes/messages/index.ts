import { Router } from "express";
import { getBatch } from "./GetBatch";

const messagesRouter = Router();

messagesRouter.get("/", getBatch);

export default messagesRouter;