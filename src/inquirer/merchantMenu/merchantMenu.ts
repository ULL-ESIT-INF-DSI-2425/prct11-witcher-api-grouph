import inquirer from "inquirer";
import chalk from "chalk";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
} from "../utils/menuUtils.js";
import { mainMenu } from "../mainMenu.js";
import { JsonMerchantCollection } from "../../data/merchantDB.js";
import { addMerchant } from "./addMerchant.js";
import { deleteMerchant } from "./deleteMerchant.js";
import { updateMerchant } from "./updateMerchant.js";
import { listMerchant } from "./listMerchants.js";
import { Profession } from "../../merchant.js";

/**
 * Inquirer prompt to manage merchants.
 */
export const merchantDB = new JsonMerchantCollection();

/**
 * List of valid professions for merchants.
 */
export const validProfessions: Profession[] = [
  "Blacksmith",
  "Alchemist",
  "General Merchant",
  "Butcher",
  "Druid",
  "Smuggler",
] as const;

/**
 * Inquirer prompt to manage merchants.
 */
export function merchantMenu(): void {
  displayTitle("Manage Merchants");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.green("Add Merchant"), value: "add" },
          { name: chalk.red("Delete Merchant"), value: "delete" },
          { name: chalk.blue("Update Merchant"), value: "update" },
          { name: chalk.magenta("List Merchants"), value: "list" },
          new inquirer.Separator(),
          { name: chalk.yellow("↩ Return to Main Menu"), value: "back" },
        ],
      },
    ])
    .then((answers) => {
      const action = answers["option"] as string;
      if (action === "back") return mainMenu();

      switch (action) {
        case "add":
          return addMerchant();
        case "delete":
          return deleteMerchant();
        case "update":
          return updateMerchant();
        case "list":
          return listMerchant();
        default:
          showError("Invalid action");
      }
      pressEnterToContinue().then(() => merchantMenu());
    });
}
