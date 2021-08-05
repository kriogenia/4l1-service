import { Router } from "express";
import { validateCredentials } from "./Login";

const authRouter = Router();

/* POST /validate */
authRouter.post("/validate", validateCredentials);

export default authRouter;