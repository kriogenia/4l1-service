import { Router } from "express";
import { refresh } from "./Refresh";
import { signIn } from "./SignIn";

const authRouter = Router();

/* GET /auth/signin */
authRouter.get("/signin/:token", signIn);

/* GET /auth/refresh */
authRouter.post("/refresh", refresh);

/* POST /auth/logout */

export default authRouter;