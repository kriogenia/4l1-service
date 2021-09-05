import { Router } from "express";
import bondRouter from "./bond";
import { cared } from "./GetCared";
import { update } from "./UpdateUser";

const userRouter = Router();

/* /user/bond/ */
userRouter.use("/bond", bondRouter);

/* GET /user/cared */
userRouter.get("/cared", cared);

/* PUT /user/update */
userRouter.put("/update", update);

export default userRouter;