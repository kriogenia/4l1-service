import { Router } from "express";
import { generate } from "./GenerateBond";

const bondRouter = Router();

/* GET /user/bond/generate */
bondRouter.get("/generate", generate);

export default bondRouter;