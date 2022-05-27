import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

import router from './routes/index.js';

import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const HOST = 'localhost';

app.listen(process.env.DOOR, HOST, () => {
  console.log(chalk.bold.green(`Server running on ${process.env.DOOR}`));
});