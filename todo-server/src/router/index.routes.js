import { Router } from "express";
import { taskRouter} from "./task.routes.js";

export const indexRouter = Router();

indexRouter.use('/api/tasks',taskRouter);

