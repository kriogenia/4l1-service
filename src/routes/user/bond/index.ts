import { Router } from "express";
import { list } from "./BondsList";
import { establish } from "./EstablishBond";
import { generate } from "./GenerateBond";

const bondRouter = Router();

/* GET /user/bonds */
bondRouter.get("", list);

/* POST /user/bonds/establish */
bondRouter.post("/establish", establish);

/* GET /user/bonds/generate */
bondRouter.get("/generate", generate);

export default bondRouter;