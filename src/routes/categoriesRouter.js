import { Router } from 'express';

import { getCategories, postCategorie } from '../controllers/categoriesController.js';
import { categorieValidation } from '../middlewares/categoriesMiddleware.js';

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', categorieValidation, postCategorie);

export default categoriesRouter;