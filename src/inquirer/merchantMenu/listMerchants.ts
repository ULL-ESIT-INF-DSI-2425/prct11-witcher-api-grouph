import chalk from "chalk";
import inquirer from "inquirer";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
} from "../utils/menuUtils.js";
import { merchantMenu, merchantDB, validProfessions } from "./merchantMenu.js";

/**
 * Inquirer prompt to list merchants.
 */
export function listMerchant(): void {
  displayTitle("Merchants List Menu");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.magenta("List All Merchants"), value: "list" },
          { name: chalk.blue("Filter by Name"), value: "filterName" },
          {
            name: chalk.blue("Filter by Profession"),
            value: "filterProfession",
          },
          { name: chalk.blue("Filter by Location"), value: "filterLocation" },
          new inquirer.Separator(),
          { name: chalk.yellow("↩ Return to Merchants Menu"), value: "back" },
        ],
        loop: false,
      },
    ])
    .then((answers) => {
      const option = answers["option"];
      if (option === "back") {
        return merchantMenu();
      }

      switch (option) {
        case "list":
          return listAllMerchants();
        case "filterName":
          return filterMerchantByName();
        case "filterProfession":
          return filterMerchantByProfession();
        case "filterLocation":
          return filterMerchantByLocation();
        default:
          showError("Invalid action");
      }
      pressEnterToContinue().then(() => merchantMenu());
    });
}

/**
 * Display all merchants in the database.
 */
export function listAllMerchants(): void {
  displayTitle("List All Merchants");

  const merchants = merchantDB.getMerchants();

  if (merchants.length === 0) {
    console.log(chalk.yellow("No merchants found."));
  } else {
    console.log(chalk.green("Registered Merchants:"));

    const tableData = merchants.map((merchant) => ({
      ID: merchant.id,
      Name: merchant.name,
      Profession: merchant.profession,
      Location: merchant.location,
    }));

    console.table(tableData);
  }
  pressEnterToContinue().then(() => listMerchant());
}

/**
 * Inquirer prompt to filter merchants by name.
 */
export function filterMerchantByName(): void {
  displayTitle("Filter by Name");
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the merchant to filter:",
      },
    ])
    .then((answers) => {
      const filteredMerchants = merchantDB.getMerchantByName(answers.name);

      console.clear();
      displayTitle("Filtered Merchants");

      if (filteredMerchants.length === 0) {
        console.log(chalk.yellow("No merchants found with that name."));
      } else {
        console.log(chalk.green("Matching Merchants:"));
        console.table(
          filteredMerchants.map((merchant) => ({
            ID: merchant.id,
            Name: merchant.name,
            Profession: merchant.profession,
            Location: merchant.location,
          })),
        );
      }

      return pressEnterToContinue();
    })
    .then(() => listMerchant());
}

/**
 * Inquirer prompt to filter merchants by profession.
 */
export function filterMerchantByProfession(): void {
  displayTitle("Filter by Profession");
  inquirer
    .prompt([
      {
        type: "list",
        name: "profession",
        message: "Select the profession of the merchant:",
        choices: validProfessions,
      },
    ])
    .then((answers) => {
      const filteredMerchants = merchantDB.getMerchantByProfession(
        answers.profession,
      );

      console.clear();
      displayTitle("Filtered Merchants");

      if (filteredMerchants.length === 0) {
        console.log(chalk.yellow("No merchants found with this profession."));
      } else {
        console.log(chalk.green("Matching Merchants:"));
        console.table(
          filteredMerchants.map((merchant) => ({
            ID: merchant.id,
            Name: merchant.name,
            Profession: merchant.profession,
            Location: merchant.location,
          })),
        );
      }

      return pressEnterToContinue();
    })
    .then(() => listMerchant());
}

/**
 * Inquirer prompt to filter merchants by location.
 */
export function filterMerchantByLocation(): void {
  displayTitle("Filter by Location");
  inquirer
    .prompt([
      {
        type: "input",
        name: "location",
        message: "Enter the location of the merchant to filter:",
      },
    ])
    .then((answers) => {
      const filteredMerchants = merchantDB.getMerchantByLocation(
        answers.location,
      );

      console.clear();
      displayTitle("Filtered Merchants");

      if (filteredMerchants.length === 0) {
        console.log(chalk.yellow("No merchants found in that location."));
      } else {
        console.log(chalk.green("Matching Merchants:"));
        console.table(
          filteredMerchants.map((merchant) => ({
            ID: merchant.id,
            Name: merchant.name,
            Profession: merchant.profession,
            Location: merchant.location,
          })),
        );
      }

      return pressEnterToContinue();
    })
    .then(() => listMerchant());
}
