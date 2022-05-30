import db from '../database.js';

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
    console.log('Erro ao pegar alugueis', e);
    res.status(422).send(e);
  }
}

export async function finishRentalValidation(req, res, next) {

  const {id} = req.params;

  try {
    const rentalSearch = await db.query('SELECT * FROM rentals WHERE rentals.id = $1;', [id]);

    if (rentalSearch.rows.length === 0) return res.sendStatus(404);

    if (rentalSearch.rows[0].returnDate != null) return res.sendStatus(400);

    next();
  } catch (e) {
    console.log('Erro ao finalizar aluguel', e);
    res.status(422).send(e);
  }
}

export async function deleteValidation(req, res, next) {
  const {id} = req.params;

  try {
    const rentalSearch = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);

    if (rentalSearch.rows.length === 0) return res.sendStatus(404);

    if (rentalSearch.rows[0].returnDate != null) return res.sendStatus(400);

    next();
  } catch (e) {
    console.log('Erro ao deletar aluguel', e);
    res.status(422).send(e);
  }
}