import db from '../database.js';
import dayjs from 'dayjs';
import chalk from 'chalk';

export async function postRental(req, res) {
  const {customerId, gameId, daysRented} = req.body;

  const rentDate = dayjs().format('YYYY-MM-DD');
  
  try {
    const gameSearch = await db.query('SELECT * FROM games WHERE id = $1;', [gameId]);

    const originalPrice = gameSearch.rows[0].pricePerDay * daysRented;

    const query = `
    INSERT INTO rentals
    ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
    VALUES
    ($1, $2, $3, $4, $5, $6, $7);
    `;

    await db.query(query, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

    res.sendStatus(201);

    } catch (e) {
    console.log(chalk.bold.red('Erro ao inserir aluguel', e));
    res.status(422).send(e);
  }
}

export async function getRentals(req, res) {
  const {customerId, gameId} = req.query;

  const query = `
  SELECT rentals.*, customers.id as "customerIdQ", customers.name as "customerName", games.id as "gameIdQ", games.name as "gameName", games."categoryId", categories.name as "categoryName"
  FROM rentals JOIN customers ON customers.id = rentals."customerId"
  JOIN games ON games.id = rentals."gameId"
  JOIN categories ON games."categoryId" = categories.id
  `;

  let rentals = '';

  try {

    if (!customerId && !gameId) rentals = await db.query(query, []);

    if (customerId) rentals = await db.query(`${query} WHERE customers.id = $1`, [customerId]);

    if (gameId) rentals = await db.query(`${query} WHERE games.id = $1`, [gameId]);

    if (customerId && gameId) rentals = await db.query(`${query} WHERE customers.id = $1 AND games.id = $2`, [customerId, gameId]);

    const rentalsFormatted = format(rentals.rows);

    res.send(rentalsFormatted);
  } catch (e) {
    console.log(chalk.bold.red('Erro ao pegar alugueis', e));
    res.status(422).send(e);
  }
}

function format (rentals) {
  return rentals.map(rental => {

    const {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, customerIdQ, customerName, gameIdQ, gameName, categoryId, categoryName} = rental;

    const rentDateFormat = rentDate.toISOString().split('T')[0];

    return(
      {
        id, customerId, gameId,
        rentDate: rentDateFormat,
        daysRented, returnDate, originalPrice, delayFee,
        customer: {
          id: customerIdQ,
          name: customerName
        },
        game: {
          id: gameIdQ,
          name: gameName,
          categoryId, categoryName
        }
      }
    )
  })
}

export async function finishRental(req, res) {
  const {id} = req.params;

  const returnDate = dayjs().format('YYYY-MM-DD');

  const query = `
  UPDATE rentals
  SET
    "returnDate" = $1,
    "delayFee" = $2
  WHERE
    id = $3
  `;

  try {
    const rentalSearch = await db.query('SELECT * FROM rentals WHERE id = $1;', [id]);

    const milissecDifference = Math.abs(new Date(returnDate).getTime() - new Date(rentalSearch.rows[0].rentDate).getTime());
    const daysDifference = milissecDifference/(1000 * 3600 * 24);

    let delayFee = 0;

    if (daysDifference > rentalSearch.rows[0].daysRented) {
      delayFee = daysDifference * (rentalSearch.rows[0].originalPrice / rentalSearch.rows[0].daysRented)
    };

    await db.query(query, [returnDate, delayFee, id]);

    res.sendStatus(200);

  } catch (e) {
    console.log(chalk.bold.red('Erro ao finalizar aluguel', e));
    res.status(422).send(e);
  }
}

export async function deleteRental(req, res) {
  const {id} = req.params;

  try {
    await db.query('DELETE FROM rentals WHERE id = $1;', [id]);

    res.sendStatus(200);
  } catch (e) {
    console.log(chalk.bold.red('Erro ao deletar aluguel', e));
    res.status(422).send(e);
  }
}