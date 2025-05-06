import { connect } from 'mongoose';
import chalk from 'chalk';

try {
  await connect(process.env.MONGODB_URL! || "mongodb://127.0.0.1:27017/TheWitcherAPI");
  console.log(chalk.green('Connection to MongoDB server established'));
} catch (error) {
  console.log(error);
}