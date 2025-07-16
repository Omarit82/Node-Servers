import { Router } from "express";
import { hubspotConnection, getCompanies,handleCallback,getTickets, getContacts, getTasks } from "../Controllers/husbpot.controller.js";

const hubspotRouter = Router();

hubspotRouter.get('/install',hubspotConnection);
hubspotRouter.get('/oauth-callback',handleCallback);
hubspotRouter.get('/tasks',getTasks);
hubspotRouter.get('/contacts',getContacts);
hubspotRouter.get('/tickets',getTickets);
hubspotRouter.get('/companies',getCompanies);

export default hubspotRouter;