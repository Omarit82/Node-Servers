import { Router } from 'express';
import userRouter from './user.routes.js';

const indexRouter = Router();

indexRouter.use('/users',userRouter);

export default indexRouter;