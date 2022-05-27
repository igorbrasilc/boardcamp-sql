import { Router } from 'express';

import { getGames, postGame } from '../controllers/gamesController.js';
import { gameValidation } from '../middlewares/gamesMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames);
gamesRouter.post('/games', gameValidation, postGame);

export default gamesRouter;