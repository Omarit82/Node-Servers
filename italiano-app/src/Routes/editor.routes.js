import { Router } from 'express';
import { editorController } from '../Controller/editor.controller.js';

const editorRouter = Router();

editorRouter.post('/', editorController);

export default editorRouter;