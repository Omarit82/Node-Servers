import { Router } from 'express';
import sessionsRouter from './sessions.routes.js';

const indexRouter = Router();

indexRouter.use('/',sessionsRouter);

export default indexRouter;