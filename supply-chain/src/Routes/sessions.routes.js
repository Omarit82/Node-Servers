import {Router} from 'express';
import { login, logout, register } from '../Controllers/sessions.controller.js';
import passport from 'passport';

const sessionsRouter = Router();

sessionsRouter.post('/login',passport.authenticate('login'),login);
sessionsRouter.post('/register',passport.authenticate('register'),register);
sessionsRouter.get('/logout',logout);
sessionsRouter.get('/auth/google',passport.authenticate('google', {scope: ['profile','email']}))
sessionsRouter.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/session/login'}),login)

export default sessionsRouter;