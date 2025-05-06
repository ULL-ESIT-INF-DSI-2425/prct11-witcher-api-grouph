import { app } from './app.js';
import chalk from 'chalk';
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(chalk.blue(`Server is up on port ${port}`));
  console.log(chalk.magenta(`http://localhost:${port}`));
});