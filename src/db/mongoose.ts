import { connect } from 'mongoose';
import chalk from 'chalk';

try {
  await connect('mongodb://localhost:27017/TheWitcherAPI');
  console.log(chalk.green('Connection to MongoDB server established'));
} catch (error) {
  console.log(error);
}