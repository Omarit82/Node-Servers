import { Router } from "express";
import { hubspotConnection, handleCallback, getContacts, getTasks } from "../Controllers/husbpot.controller.js";

const hubspotRouter = Router();

hubspotRouter.get('/install',hubspotConnection);
hubspotRouter.get('/oauth-callback',handleCallback);
hubspotRouter.get('/tasks',getTasks);
hubspotRouter.get('/contacts',getContacts);

export default hubspotRouter;