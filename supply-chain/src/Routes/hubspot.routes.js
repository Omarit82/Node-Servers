import { Router } from "express";
import { hubspotConnection,handleCallback, getDeals,updateDeal,getTask,taskProperties, getLineItemFromDeal, dealProperties, analytics, getClient, companiesProperties, listadoProductos, updateTask} from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);

hubspotRouter.get('/deals/:stage/:completed',ensureAuthenticate,getDeals)
hubspotRouter.get('/task/:id',ensureAuthenticate,getTask);
hubspotRouter.get('/clients/:id',getClient);
hubspotRouter.get('/lineItem/:id',getLineItemFromDeal);
hubspotRouter.get('/analytics',analytics);

hubspotRouter.put('/deals',ensureAuthenticate,updateDeal)
hubspotRouter.put('/task/:id',ensureAuthenticate,updateTask)

/**DEBUG ROUTES**/
hubspotRouter.get('/tasksProperties',taskProperties);
hubspotRouter.get('/dealProperties',dealProperties);
hubspotRouter.get('/companiesProperties',companiesProperties);
hubspotRouter.get('/products',listadoProductos);


export default hubspotRouter;