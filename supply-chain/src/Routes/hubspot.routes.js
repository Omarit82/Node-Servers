import { Router } from "express";
import { getTasks } from "../Controllers/husbpot.controller.js";

const hubspotRouter = Router();

hubspotRouter.get('/tasks',getTasks);

export default hubspotRouter;