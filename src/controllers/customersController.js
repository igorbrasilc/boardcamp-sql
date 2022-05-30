import db from '../database.js';

export async function getCustomers(req, res) {
  const {cpf} = req.query;

  try {
    if (!cpf) {
      const customers = await db.query('SELECT * FROM customers;');
      res.send(customers.rows);
    } else {
      const query = 'SELECT * FROM customers WHERE cpf LIKE $1;';
      const customers = await db.query(query, [`${cpf}%`]);
      res.send(customers.rows);
    }
  } catch (e) {
    console.log('Erro ao buscar clientes', e);
    res.status(422).send(e);
  }
}

export async function getCustomerById(req, res) {
  const {id} = req.params;

  try {
    const customer = await db.query('SELECT * FROM customers WHERE id = $1;', [id]);

    if (customer.rows.length === 0) return res.sendStatus(404);

    res.send(customer.rows[0]);
  } catch (e) {
    console.log('Erro ao buscar clientes', e);
    res.status(422).send(e);
  }
}

export async function postCustomer(req, res) {
  const {name, phone, cpf, birthday} = req.body;

  const query = `
  INSERT INTO customers
  (name, phone, cpf, birthday) VALUES
  ($1, $2, $3, $4);
  `;

  try {
    await db.query(query, [name, phone, cpf, birthday]);

    res.sendStatus(201);
  } catch (e) {
    console.log('Erro ao inserir cliente', e);
    res.status(422).send(e);
  }
}

export async function updateCustomer(req, res) {
  const {name, phone, cpf, birthday} = req.body;
  const {id} = req.params;

  const query = `
  UPDATE customers
  SET 
    name = $1,
    phone = $2,
    cpf = $3,
    birthday = $4
  WHERE id = $5;
  `;

  try {
    await db.query(query, [name, phone, cpf, birthday, id]);

    res.sendStatus(200);
  } catch (e) {
    console.log('Erro ao atualizar cliente', e);
    res.status(422).send(e);
  }
}