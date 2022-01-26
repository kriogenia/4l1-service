import { Router } from "express";
import { validateToken } from "../middlewares";
import { refresh } from "./Refresh";
import { signIn } from "./SignIn";
import { signOut } from "./SignOut";

const authRouter = Router();

/* GET /auth/signin/{token} */
authRouter.get("/signin/:token", signIn);

/* DELETE /auth/session/{token} */
const logOutRouter = Router();			// Internal private endpoint
logOutRouter.delete("/session/:token", signOut);
authRouter.use(validateToken, logOutRouter);

/* GET /auth/refresh/{token} */
authRouter.get("/refresh/:token", refresh);

export default authRouter;