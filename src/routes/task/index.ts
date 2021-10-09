import { Router } from "express";
import { getTasks } from "./GetTasks";
import { newTask } from "./NewTask";
import { setDone } from "./SetDone";

const taskRouter = Router();

/* POST /tasks */
taskRouter.post("", newTask);

/* GET /tasks */
taskRouter.get("", getTasks);

/* PATCH tasks/:id */
/* DELETE tasks/:id */

/* POST /tasks:/:id/done */
taskRouter.post("/:id/done", setDone(true));
/* DELETE /tasks:/:id/done */
taskRouter.delete("/:id/done", setDone(false));

export default taskRouter;