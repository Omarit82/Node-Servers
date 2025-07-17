import { Router } from "express";
import { hubspotConnection, getCompanies,handleCallback,getTickets, getContacts, getTasks } from "../Controllers/husbpot.controller.js";
import { ensureAuthenticate } from "../Config/passport.config.js";


const hubspotRouter = Router();

hubspotRouter.get('/install',ensureAuthenticate,hubspotConnection);
hubspotRouter.get('/oauth-callback',ensureAuthenticate,handleCallback);
hubspotRouter.get('/tasks',ensureAuthenticate,getTasks);
hubspotRouter.get('/contacts',ensureAuthenticate,getContacts);
hubspotRouter.get('/tickets',ensureAuthenticate,getTickets);
hubspotRouter.get('/companies',ensureAuthenticate,getCompanies);

export default hubspotRouter;