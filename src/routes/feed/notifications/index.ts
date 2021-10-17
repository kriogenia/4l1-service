import { Router } from "express";
import { getNotifications } from "./GetNotifications";

const notificationsRouter = Router();

/* GET /feed/notifications */
notificationsRouter.get("/", getNotifications);

export default notificationsRouter;