import { Router } from 'express';

import { getCustomers, getCustomerById, postCustomer, updateCustomer } from '../controllers/customersController.js';
import { customerValidation, customerUpdateValidation } from '../middlewares/customersMiddleware.js';

const customersRouter = Router();

customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', getCustomerById);
customersRouter.post('/customers', customerValidation, postCustomer);
customersRouter.put('/customers/:id', customerUpdateValidation, updateCustomer)

export default customersRouter;