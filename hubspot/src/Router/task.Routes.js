import { Router } from 'express';
import { getTasks } from '../Controller/tasks.controller.js';

const tasksRouter = Router();

tasksRouter.get('/tasks',getTasks);

export default tasksRouter;