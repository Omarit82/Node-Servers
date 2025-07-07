import {Router} from 'express';
import { login, register } from '../Controllers/sessions.controller.js';
import passport from 'passport';

const sessionsRouter = Router();

sessionsRouter.post('/login',passport.authenticate('login'),login);
sessionsRouter.post('/register',passport.authenticate('register'),register);

export default sessionsRouter;