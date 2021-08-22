import { Router } from "express";
import { update } from "./Update";

const userRouter = Router();

/* PUT /user/update */
userRouter.put("/update", update);

export default userRouter;