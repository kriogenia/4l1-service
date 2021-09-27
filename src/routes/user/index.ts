import { Router } from "express";
import bondRouter from "./bond";
import { cared } from "./GetCared";
import { update } from "./UpdateUser";

const userRouter = Router();

/* /user/bonds/ */
userRouter.use("/bond", bondRouter);

/* GET /user/:id/cared */
userRouter.get("/cared", cared);

/* PUT /user/:id */
userRouter.put("/update", update);

export default userRouter;