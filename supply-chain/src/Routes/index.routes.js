import { Router } from 'express';
import sessionsRouter from './sessions.routes.js';

const indexRouter = Router();

indexRouter.use('/sessions',sessionsRouter);

export default indexRouter;