import db from '../database.js'

export async function categorieValidation(req, res, next) {
  const {name} = req.body;

  if (!name) return res.sendStatus(400);

  try {
    const categorieSearch = await db.query('SELECT * FROM categories WHERE name = $1', [name]);
    
    if (categorieSearch.rows.length !== 0) return res.sendStatus(409);

  } catch (e) {
    console.log('Não foi possível buscar este nome no servidor', e);
    res.status(422).send('Não foi possível buscar este nome no servidor', e);
  }

  next();
}