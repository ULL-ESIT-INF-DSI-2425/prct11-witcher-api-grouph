import express from "express";
import "./db/mongoose.js";

import { defaultRouter } from "./routers/defaultRouter.js";
import { itemRouter } from "./routers/itemRouter.js";
import { hunterRouter } from "./routers/hunterRouter.js";
import { transactionRouter } from "./routers/transactionRouter.js";
import chalk from "chalk";
import { merchantRouter } from "./routers/merchantRouter.js";
const port = process.env.PORT || 3000;

export const app: express.Application = express();
app.use(express.json());
app.use(hunterRouter);
app.use(itemRouter);
app.use(transactionRouter);
app.use(merchantRouter);
//app.use(defaultRouter);

app.listen(port, () => {
  console.log(chalk.blue(`Server is up on port ${port}`));
  console.log(chalk.magenta(`http://localhost:${port}`));
});
