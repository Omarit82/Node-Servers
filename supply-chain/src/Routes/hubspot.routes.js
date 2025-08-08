import { Router } from "express";
import { hubspotConnection,handleCallback, getTasks, getDeals, getTask, getLineItems, analytics } from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);
hubspotRouter.get('/tasks',ensureAuthenticate,getTasks);
hubspotRouter.get('/task/:id',ensureAuthenticate,getTask);
hubspotRouter.get('/deals',ensureAuthenticate,getDeals)
hubspotRouter.get('/lineItem/:id',getLineItems);
hubspotRouter.get('/analytics',analytics);


export default hubspotRouter;