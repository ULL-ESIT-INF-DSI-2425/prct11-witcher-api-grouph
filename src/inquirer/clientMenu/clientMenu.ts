import inquirer from "inquirer";
import chalk from "chalk";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
} from "../utils/menuUtils.js";
import { mainMenu } from "../mainMenu.js";
import { addClient } from "./addClient.js";
import { deleteClient } from "./deleteClient.js";
import { updateClient } from "./updateClient.js";
import { listClient } from "./listsClient.js";
import { JsonClientCollection } from "../../data/clientDB.js";
import { Race } from "../../hunter.js";

/**
 * Collection of clients
 */
export const clientDB = new JsonClientCollection();

/**
 * Array of valid races
 */
export const validRaces: Race[] = [
  "Human",
  "Elf",
  "Dwarf",
  "Halfling",
  "Warlock",
  "Lycanthropic",
  "Vran",
  "Dryad",
  "Spectral Cat",
  "Half-Elf",
] as const;

/**
 * Function to display the client menu
 */
export function clientMenu(): void {
  displayTitle("Manage Clients");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.green("Add Client"), value: "add" },
          { name: chalk.red("Delete Client"), value: "delete" },
          { name: chalk.blue("Update Client"), value: "update" },
          { name: chalk.magenta("List Clients"), value: "list" },
          new inquirer.Separator(),
          { name: chalk.yellow("↩ Return to Main Menu"), value: "back" },
        ],
      },
    ])
    .then(({ option }) => {
      if (option === "back") return mainMenu();

      switch (option) {
        case "add":
          return addClient();
        case "delete":
          return deleteClient();
        case "update":
          return updateClient();
        case "list":
          return listClient();
        default:
          showError("Invalid action");
      }
      pressEnterToContinue().then(() => clientMenu());
    });
}
