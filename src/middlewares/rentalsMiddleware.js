import db from '../database.js';
import chalk from 'chalk';

export async function rentalValidation(req, res, next) {
  const {customerId, gameId, daysRented} = req.body;

  try {
    const customerSearch = await db.query('SELECT * FROM customers WHERE id = $1;', [customerId]);
    const gameSearch = await db.query('SELECT * FROM games WHERE id = $1;', [gameId]);
    const rentalSearch = await db.query('SELECT * FROM rentals WHERE "gameId" = $1;', [gameId]);

    console.log(gameSearch);

    const daysValidation = daysRented < 1;
    const customerValidation = customerSearch.rows.length === 0;
    const gameValidation = gameSearch.rows.length === 0;
    const stockValidation = rentalSearch.rows.length < gameSearch.rows[0]?.stockTotal;

    if (customerValidation || gameValidation || daysValidation || !stockValidation) return res.sendStatus(400);

    next();
  } catch (e) {
    console.log(chalk.bold.red('Erro ao pegar alugueis', e));
    res.status(422).send(e);
  }
}