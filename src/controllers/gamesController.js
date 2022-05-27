import db from '../database.js';
import chalk from 'chalk';

export async function getGames(req, res) {

  const {name} = req.query;

  try {
    if (!name) {

      const query = `
      SELECT games.*, categories.name as categoryName
      FROM games 
      JOIN categories 
      ON games."categoryId" = categories.id;
      `;

      const games = await db.query(query);

      res.send(games.rows);
    } else {
      const query = `
      SELECT games.*, categories.name as categoryName
      FROM games
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE games.name
      ILIKE $1;
      `;

      const games = await db.query(query, [`${name}%`]);

      res.send(games.rows);
    }
  } catch (e) {
    console.log(chalk.bold.red('Erro ao buscar jogos', e));
    res.status(422).send(e);
  }
}

export async function postGame(req, res) {

  const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
  
  const query = `
  INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);
  `;

  try {
    await db.query(query, [name, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(201);
  } catch (e) {
    console.log(chalk.bold.red('Erro ao buscar jogos', e));
    res.status(422).send(e);
  }
};