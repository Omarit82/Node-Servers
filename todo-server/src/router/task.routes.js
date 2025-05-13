import { Router } from "express";
import { getTasks,createTask/*,getTask,updateTask*/,deleteTask } from "../controller/task.controller.js"

export const taskRouter = Router();

taskRouter.get('/',getTasks);
taskRouter.post('/',createTask);
/*taskRouter.get('/:id',getTask);
taskRouter.put('/:id',updateTask);*/
taskRouter.delete('/:id',deleteTask);