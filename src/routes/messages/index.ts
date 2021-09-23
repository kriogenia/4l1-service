import { getBatch } from "@/services/FeedService";
import { Router } from "express";

const messagesRouter = Router();

messagesRouter.get("/", getBatch);

export default messagesRouter;