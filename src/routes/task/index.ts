import { Router } from "express";
import { getTasks } from "./GetTasks";
import { newTask } from "./NewTask";

const taskRouter = Router();

/* POST /tasks */
taskRouter.post("", newTask);

/* GET /tasks */
taskRouter.get("", getTasks);

/* PUT tasks/:id */
/* DELETE tasks/:id */

/* POST /tasks:/:id/done */
/* DELETE /tasks:/:id/done */

export default taskRouter;