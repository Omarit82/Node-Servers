import { Router } from "express";
import { getTasks, hubspotConnection, handleCallback } from "../Controllers/husbpot.controller.js";

const hubspotRouter = Router();

hubspotRouter.get('/install',hubspotConnection);
hubspotRouter.get('/oauth-callback',handleCallback);
hubspotRouter.get('/tasks',getTasks);

export default hubspotRouter;