import express from 'express';
import cors from 'cors';

import router from './routes/index.js';

import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(process.env.DOOR, () => {
  console.log(`Server running on ${process.env.DOOR}`);
});