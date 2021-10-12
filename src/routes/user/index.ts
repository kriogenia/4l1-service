import { Router } from "express";
import bondRouter from "./bond";
import { cared } from "./GetCared";
import { update } from "./UpdateUser";

const userRouter = Router();

/* PATCH /user/:id */
userRouter.patch("/:id", update);

/* GET /user/:id/cared */
userRouter.get("/:id/cared", cared);

/* /user/bonds/ */
userRouter.use("/bonds", bondRouter);

export default userRouter;