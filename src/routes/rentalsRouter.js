import { Router } from 'express';

import { rentalValidation, finishRentalValidation, deleteValidation } from '../middlewares/rentalsMiddleware.js';
import { postRental, getRentals, finishRental, deleteRental } from '../controllers/rentalsController.js';

const rentalsRouter = Router();

rentalsRouter.post('/rentals', rentalValidation, postRental);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals/:id/return', finishRentalValidation, finishRental);
rentalsRouter.delete('/rentals/:id', deleteValidation, deleteRental)

export default rentalsRouter;