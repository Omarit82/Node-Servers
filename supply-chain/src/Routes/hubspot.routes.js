import { Router } from "express";
import { hubspotConnection,handleCallback,despachosReales, getDeals,updateDeal,getTask,taskProperties, getLineItemFromDeal, dealProperties, getClient, companiesProperties, listadoProductos, updateTask, dealsAnalitics} from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);

hubspotRouter.get('/dealsAnalitics',ensureAuthenticate,dealsAnalitics);
hubspotRouter.get('/despachosReales',ensureAuthenticate, despachosReales)
hubspotRouter.get('/deals/:stage/:completed',ensureAuthenticate,getDeals);
hubspotRouter.get('/task/:id',ensureAuthenticate,getTask);
hubspotRouter.get('/clients/:id',getClient);
hubspotRouter.get('/lineItem/:id',getLineItemFromDeal);

hubspotRouter.put('/deals',ensureAuthenticate,updateDeal)
hubspotRouter.put('/task/:id',ensureAuthenticate,updateTask)


/**DEBUG ROUTES**/
hubspotRouter.get('/tasksProperties',taskProperties);
hubspotRouter.get('/dealProperties',dealProperties);
hubspotRouter.get('/companiesProperties',companiesProperties);
hubspotRouter.get('/products',listadoProductos);


export default hubspotRouter;