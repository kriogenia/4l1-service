import { Router } from "express";
import { deleteTask } from "./DeleteTask";
import { getTasks } from "./GetTasks";
import { newTask } from "./NewTask";
import { setDone } from "./SetDone";

const taskRouter = Router();

/* POST /tasks */
taskRouter.post("", newTask);

/* GET /tasks */
taskRouter.get("", getTasks);

/* PATCH /tasks/:id */
/* DELETE /tasks/:id */
taskRouter.delete("/:id", deleteTask);

/* POST /tasks:/:id/done */
taskRouter.post("/:id/done", setDone(true));
/* DELETE /tasks:/:id/done */
taskRouter.delete("/:id/done", setDone(false));

export default taskRouter;