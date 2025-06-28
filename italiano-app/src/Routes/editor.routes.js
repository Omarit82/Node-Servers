import { Router } from 'express';
import { editorController, getConiugazione, getVerbos } from '../Controller/editor.controller.js';

const editorRouter = Router();

editorRouter.post('/', editorController);
editorRouter.get('/',getVerbos);
editorRouter.post('/verbo',getConiugazione);

export default editorRouter;