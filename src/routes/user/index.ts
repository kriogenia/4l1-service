import { Router } from "express";
import bondRouter from "./bond";
import { cared } from "./GetCared";
import { update } from "./UpdateUser";

const userRouter = Router();

/* PUT /user/:id */
userRouter.put("/:id", update);

/* GET /user/:id/cared */
userRouter.get("/:id/cared", cared);

/* /user/bonds/ */
userRouter.use("/bond", bondRouter);

export default userRouter;