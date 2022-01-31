import { Router } from "express";
import { list } from "./BondsList";
import { establish } from "./EstablishBond";
import { generate } from "./GenerateBond";
import { removeBond } from "./RemoveBond";

const bondRouter = Router();

/* GET /user/bonds */
bondRouter.get("", list);

/* DELETE /user/bonds/:id */
bondRouter.delete("/:id", removeBond);

/* POST /user/bonds/establish */
bondRouter.post("/establish", establish);

/* GET /user/bonds/generate */
bondRouter.get("/generate", generate);

export default bondRouter;