import mongoose from "mongoose";
import chalk from "chalk";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log(chalk.green("Connected to MongoDB Atlas"));
  } catch (error) {
    console.error(chalk.red("Failed to connect to MongoDB Atlas"), error);
    process.exit(1);
  }
};