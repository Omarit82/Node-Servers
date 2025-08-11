import { Router } from "express";
import { hubspotConnection,handleCallback,getAllDeals, getDeals,updateDeal, getTask,endTask,taskProperties, getLineItemFromDeal, dealProperties, analytics} from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);
hubspotRouter.get('/task/:id',ensureAuthenticate,getTask);
hubspotRouter.put('/task/:id',ensureAuthenticate,endTask);
hubspotRouter.get('/deals/:stage/:completed',ensureAuthenticate,getDeals)
hubspotRouter.put('/deals',ensureAuthenticate,updateDeal)

/**DEBUG ROUTES**/
hubspotRouter.get('/deals',ensureAuthenticate,getAllDeals)
hubspotRouter.get('/analytics',analytics);
hubspotRouter.get('/tasksProperties',taskProperties);
hubspotRouter.get('/dealProperties',dealProperties);
hubspotRouter.get('/lineItem/:id',getLineItemFromDeal);

export default hubspotRouter;