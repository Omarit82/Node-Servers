import { Router } from 'express';
import tasksRouter from './task.Routes.js';

const indexRouter = Router();

indexRouter.use('/api',tasksRouter);

export default indexRouter;