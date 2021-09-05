import { Router } from "express";
import { list } from "./BondsList";
import { establish } from "./EstablishBond";
import { generate } from "./GenerateBond";

const bondRouter = Router();

/* POST /user/bond/establish */
bondRouter.post("/establish", establish);

/* GET /user/bond/generate */
bondRouter.get("/generate", generate);

/* GET /user/bond/list */
bondRouter.get("/list", list);


export default bondRouter;