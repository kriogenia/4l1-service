import { Router } from "express";
import { signIn } from "./SignIn";

const authRouter = Router();

/* GET /auth/signin */
authRouter.get("/signin/:token", signIn);

export default authRouter;