import { Router } from "express";
import { refresh } from "./Refresh";
import { signIn } from "./SignIn";

const authRouter = Router();

/* GET /auth/signin */
authRouter.get("/signin/:token", signIn);

/* POST /auth/refresh */
authRouter.post("/refresh", refresh);

export default authRouter;