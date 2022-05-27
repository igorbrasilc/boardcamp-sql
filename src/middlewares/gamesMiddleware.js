import db from '../database.js';
import joi from 'joi';

const gameSchema = joi.object({
  name: joi.string().required(),
  stockTotal: joi.number().greater(0).required(),
  pricePerDay: joi.number().greater(0).required()
});

export async function gameValidation(req, res, next) {

  const {name, stockTotal, categoryId, pricePerDay} = req.body;

  const objToValidate = {
    name,
    stockTotal, 
    pricePerDay
  };

  const validation = gameSchema.validate(objToValidate);

  if (validation.error) return res.sendStatus(400);

  try {
    const categorySearch = await db.query('SELECT id FROM categories WHERE $1 = id', [categoryId]);

    if (categorySearch.rows.length === 0) return res.sendStatus(400);

    const nameSearch = await db.query('SELECT name FROM games WHERE $1 = name', [name]);

    if (nameSearch.rows.length !== 0) return res.sendStatus(409);

    next();
  } catch (e) {
    console.log(chalk.bold.red('Erro ao buscar jogos', e));
    res.status(422).send(e);
  }
}