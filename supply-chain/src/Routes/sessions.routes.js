import {Router} from 'express';
import { login, register } from '../Controllers/sessions.controller.js';

const sessionsRouter = Router();

sessionsRouter.post('/login',login);
sessionsRouter.post('/register',register);

export default sessionsRouter;