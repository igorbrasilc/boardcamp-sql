import { Router } from 'express';

import { rentalValidation } from '../middlewares/rentalsMiddleware.js';
import { postRental, getRentals } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.post('/rentals', rentalValidation, postRental);
rentalsRouter.get('/rentals', getRentals);

export default rentalsRouter;