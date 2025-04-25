import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";
import {
  clearConsole,
  displayTitle,
  pressEnterToContinue,
  showError,
} from "./utils/menuUtils.js";
import { goodsMenu, itemDB } from "./goodsMenu/goodsMenu.js";
import { merchantDB, merchantMenu } from "./merchantMenu/merchantMenu.js";
import { clientDB, clientMenu } from "./clientMenu/clientMenu.js";
import { reportsMenu } from "./reportsMenu/reportsMenu.js";
import { Inventory } from "../inventory.js";
import { transactionsMenu } from "./transactionMenu/transactionMenu.js";

const clientCollection = clientDB;
const merchantCollection = merchantDB;
const itemCollection = itemDB;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const inventory = new Inventory(
  clientCollection,
  merchantCollection,
  itemCollection,
);

/**
 * Main menu prompt.
 */
export function mainMenu(): void {
  displayTitle("Inventory Management System");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.blue("Manage Goods"), value: "goods" },
          { name: chalk.yellow("Manage Merchants"), value: "merchants" },
          { name: chalk.green("Manage Clients"), value: "clients" },
          {
            name: chalk.magenta("Register Transaction"),
            value: "transactions",
          },
          { name: chalk.cyan("Generate Reports"), value: "reports" },
          new inquirer.Separator(),
          { name: chalk.red("Exit"), value: "exit" },
        ],
      },
    ])
    .then((answers) => {
      const option = answers["option"] as string;
      if (option === "exit") {
        clearConsole();
        console.log(
          boxen(chalk.bold("Bye ;)"), {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "cyan",
          }),
        );
        return;
      }
      switch (option) {
        case "goods":
          return goodsMenu();

        case "merchants":
          return merchantMenu();

        case "clients":
          return clientMenu();

        case "transactions":
          return transactionsMenu();

        case "reports":
          return reportsMenu();

        default:
          showError("Invalid action");
          pressEnterToContinue().then(() => mainMenu());
      }
    });
}

clearConsole();

console.log(chalk.cyan("Starting Inventory Management System..."));
setTimeout(() => {
  mainMenu();
}, 1000);
