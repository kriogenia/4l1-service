import { Router } from "express";
import { getNotifications } from "./GetNotifications";
import { setNotificationRead } from "./SetNotificationRead";

const notificationsRouter = Router();

/* GET /feed/notifications */
notificationsRouter.get("/", getNotifications);

/* POST /feed/notifications/:id/read */
notificationsRouter.post("/:id/read", setNotificationRead);

export default notificationsRouter;