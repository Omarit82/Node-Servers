import { Router } from 'express';
import sessionsRouter from './sessions.routes.js';
import hubspotRouter from './hubspot.routes.js';

const indexRouter = Router();

indexRouter.use('/',sessionsRouter);
indexRouter.use('/hubspot',hubspotRouter);

export default indexRouter;