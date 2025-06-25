import { Router } from 'express';
import { login, register } from '../Controller/user.controller.js';

const userRouter = Router();

userRouter.post('/login',login);
userRouter.post('/register',register);

export default userRouter;