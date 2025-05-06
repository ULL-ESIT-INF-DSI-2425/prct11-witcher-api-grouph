import { connect } from 'mongoose';
import chalk from 'chalk';

try {
  await connect(process.env.MONGODB_URL!);
  console.log(chalk.green('Connection to MongoDB server established'));
} catch (error) {
  console.log(error);
}