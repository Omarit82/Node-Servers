import { Router } from 'express';
import sessionsRouter from './sessions.routes.js';
import hubspotRouter from './hubspot.routes.js';
import andreaniRouter from './andreani.routes.js';

const indexRouter = Router();

indexRouter.use('/',sessionsRouter);
indexRouter.use('/hubspot',hubspotRouter);
indexRouter.use('/andreani',andreaniRouter);

export default indexRouter;