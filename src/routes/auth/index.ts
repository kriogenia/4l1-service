import { Router } from "express";
import { refresh } from "./Refresh";
import { signIn } from "./SignIn";

const authRouter = Router();

/* GET /auth/signin/{token} */
authRouter.get("/signin/:token", signIn);

/* GET /auth/refresh/{token} */
authRouter.get("/refresh/:token", refresh);

/* POST /auth/logout */

export default authRouter;