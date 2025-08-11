import { Router } from "express";
import { hubspotConnection,handleCallback, getTasks, getDeals, getTask,taskProperties, getLineItemFromDeal, dealProperties, analytics} from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);
hubspotRouter.get('/tasks',ensureAuthenticate,getTasks);
hubspotRouter.get('/task/:id',ensureAuthenticate,getTask);
hubspotRouter.get('/deals',ensureAuthenticate,getDeals)

/**DEBUG ROUTES**/
hubspotRouter.get('/analytics',analytics);
hubspotRouter.get('/tasksProperties',taskProperties);
hubspotRouter.get('/dealProperties',dealProperties);
hubspotRouter.get('/lineItem/:id',getLineItemFromDeal);

export default hubspotRouter;