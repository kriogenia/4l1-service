import { Router } from "express";
import bondRouter from "./bond";
import { update } from "./UpdateUser";

const userRouter = Router();

/* PUT /user/update */
userRouter.put("/update", update);

/* /user/bond/ */
userRouter.use("/bond", bondRouter);

export default userRouter;