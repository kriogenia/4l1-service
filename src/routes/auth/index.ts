import { Router } from "express";
import { refresh } from "./Refresh";
import { signIn } from "./SignIn";
import { signOut } from "./SignOut";

const authRouter = Router();

/* GET /auth/signin/{token} */
authRouter.get("/signin/:token", signIn);

/* DELETE /auth/session/{token} */
authRouter.delete("/session/:token", signOut);

/* GET /auth/refresh/{token} */
authRouter.get("/refresh/:token", refresh);

export default authRouter;