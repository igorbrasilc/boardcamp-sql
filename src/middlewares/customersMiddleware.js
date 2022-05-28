import db from '../database.js';
import joi from 'joi';
import JoiDate from '@joi/date';
import chalk from 'chalk';

const Joi = joi.extend(JoiDate);

const customerSchema = Joi.object({
  cpf: Joi.string().regex(/^\d{11}$/).required(),
  phone: Joi.string().regex(/^\d{10}$|^\d{11}$/).required(),
  name: Joi.string().required(),
  birthday: Joi.date().format(['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY']).raw().utc().required()
});

export async function customerValidation (req, res, next) {
  const {name, phone, cpf, birthday} = req.body;

  const objToValidate = {
    cpf, phone, name, birthday
  };

  const validation = customerSchema.validate(objToValidate);

  if (validation.error) return res.status(400).send(validation.error); 

  try {
    const customer = await db.query('SELECT * FROM customers WHERE cpf = $1;', [cpf]);

    if (customer.rows.length !== 0) return res.sendStatus(409);

  } catch (e) {
    console.log(chalk.bold.red('Erro ao verificar clientes existentes', e));
    res.status(422).send(e);
  }

  next();
}

export async function customerUpdateValidation (req, res, next) {
  const {name, phone, cpf, birthday} = req.body;
  const {id} = req.params;

  const objToValidate = {
    cpf, phone, name, birthday
  };

  const validation = customerSchema.validate(objToValidate);

  if (validation.error) return res.status(400).send(validation.error); 

  try {
    const customer = await db.query('SELECT * FROM customers WHERE id = $1;', [id]);

    if (customer.rows.length === 0) return res.sendStatus(404);

  } catch (e) {
    console.log(chalk.bold.red('Erro ao verificar clientes existentes', e));
    res.status(422).send(e);
  }

  next();
}