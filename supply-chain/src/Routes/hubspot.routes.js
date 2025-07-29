import { Router } from "express";
import { hubspotConnection,handleCallback, getTasks, getDeals } from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);
hubspotRouter.get('/tasks',ensureAuthenticate,getTasks);
hubspotRouter.get('/deals',getDeals)


export default hubspotRouter;