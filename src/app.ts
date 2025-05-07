import express from "express";
import "./db/mongoose.js";

import { defaultRouter } from "./routers/defaultRouter.js";
import { itemRouter } from "./routers/itemRouter.js";
import { hunterRouter } from "./routers/hunterRouter.js";
import { transactionRouter } from "./routers/transactionRouter.js";
import { merchantRouter } from "./routers/merchantRouter.js";

export const app: express.Application = express();
app.use(express.json());
app.use(hunterRouter);
app.use(itemRouter);
app.use(transactionRouter);
app.use(merchantRouter);
app.use(defaultRouter);
