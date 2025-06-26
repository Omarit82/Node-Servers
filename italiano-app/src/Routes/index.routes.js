import { Router } from 'express';
import userRouter from './user.routes.js';
import editorRouter from './editor.routes.js';

const indexRouter = Router();

indexRouter.use('/users',userRouter);
indexRouter.use('/editor',editorRouter);

export default indexRouter;