import { Router } from "express";
import { establish } from "./EstablishBond";
import { generate } from "./GenerateBond";

const bondRouter = Router();

/* GET /user/bond/generate */
bondRouter.get("/generate", generate);

/* GET /user/bond/establish */
bondRouter.post("/establish", establish);

export default bondRouter;