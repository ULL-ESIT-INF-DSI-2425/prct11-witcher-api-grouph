import express from 'express';
import './db/mongoose.js';

import { defaultRouter } from './routers/default.js';
//import { clientRouter } from './routers/client.js';
import { itemRouter } from './routers/item.js';
//import { goodsRouter } from './routers/goods.js';
//import { transactionRouter } from './routers/transaction.js';

export const app: express.Application = express();
app.use(express.json());
//app.use(clientRouter);
app.use(itemRouter);
//app.use(goodsRouter);
//app.use(transactionRouter);