import express from 'express';
import cors from 'cors';
import chalk from 'chalk';

import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(process.env.DOOR, () => {
  console.log(chalk.bold.green(`Server running on ${process.env.DOOR}`));
});