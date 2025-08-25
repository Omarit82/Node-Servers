import { Router } from "express";
import { makeRemito } from "../Controllers/remitos.controller.js";


const remitoRouter = Router();

remitoRouter.post('/pdf',makeRemito);

export default remitoRouter;