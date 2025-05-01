import express from 'express';
import './db/mongoose.js';

import { defaultRouter } from './routers/defaultRouter.js';
//import { clientRouter } from './routers/client.js';
import { itemRouter } from './routers/itemRouter.js';
import { hunterRouter } from './routers/hunterRouter.js';
//import { goodsRouter } from './routers/goods.js';
//import { transactionRouter } from './routers/transaction.js';

const port = 3000;

export const app: express.Application = express();
app.use(express.json());
app.use(hunterRouter);
app.use(itemRouter);
//app.use(goodsRouter);
//app.use(transactionRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
  console.log(`http://localhost:${port}`);
});