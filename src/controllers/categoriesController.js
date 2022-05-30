import db from '../database.js';

export async function getCategories(req, res) {
  try {
    const categories = await db.query('SELECT * FROM categories;');
    res.send(categories.rows);
  } catch (e) {
    console.log('Erro ao buscar categorias', e);
    res.status(422).send(encodeURI);
  }
}

export async function postCategorie(req, res) {
  const {name} = req.body;
  try {
    await db.query('INSERT INTO categories (name) VALUES ($1)', [name]);
    res.sendStatus(201);
  } catch (e) {
    console.log('Erro ao inserir categoria', e);
    res.status(422).send(e);
  }
}