import { Router } from "express";
import {saveRemito,getRemitos } from "../Controllers/remitos.controller.js";


const remitoRouter = Router();

remitoRouter.post('/save',saveRemito);
remitoRouter.get('/',getRemitos);

export default remitoRouter;