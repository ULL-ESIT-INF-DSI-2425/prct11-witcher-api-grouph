import chalk from "chalk";
import inquirer from "inquirer";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
} from "../utils/menuUtils.js";
import { clientMenu, clientDB, validRaces } from "./clientMenu.js";

/**
 * Function to list clients
 */
export function listClient(): void {
  displayTitle("Clients List Menu");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.magenta("List All Clients"), value: "list" },
          { name: chalk.blue("Filter by Name"), value: "filterName" },
          { name: chalk.blue("Filter by Race"), value: "filterRace" },
          { name: chalk.blue("Filter by Location"), value: "filterLocation" },
          new inquirer.Separator(),
          { name: chalk.yellow("↩ Return to Clients Menu"), value: "back" },
        ],
        loop: false,
      },
    ])
    .then((answers) => {
      const option = answers["option"];
      if (option === "back") {
        return clientMenu();
      }

      switch (option) {
        case "list":
          return listAllClients();
        case "filterName":
          return filterClientByName();
        case "filterRace":
          return filterClientByRace();
        case "filterLocation":
          return filterClientByLocation();
        default:
          showError("Invalid action");
      }
      pressEnterToContinue().then(() => clientMenu());
    });
}

/**
 * Function to list all clients
 */
export function listAllClients(): void {
  displayTitle("List All Clients");

  const clients = clientDB.getClients();

  if (clients.length === 0) {
    console.log(chalk.yellow("No clients found."));
  } else {
    console.log(chalk.green("Registered Clients:"));

    const tableData = clients.map((client) => ({
      ID: client.id,
      Name: client.name,
      Race: client.race,
      Location: client.location,
    }));

    console.table(tableData);
  }
  pressEnterToContinue().then(() => listClient());
}

/**
 * Function to filter clients by name
 */
export function filterClientByName(): void {
  displayTitle("Filter by Name");
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the client to filter:",
      },
    ])
    .then((answers) => {
      const filteredClients = clientDB.getClientByName(answers.name);

      console.clear();
      displayTitle("Filtered Clients");

      if (filteredClients.length === 0) {
        console.log(chalk.yellow("No clients found with that name."));
      } else {
        console.log(chalk.green("Matching Clients:"));
        console.table(
          filteredClients.map((client) => ({
            ID: client.id,
            Name: client.name,
            Race: client.race,
            Location: client.location,
          })),
        );
      }

      return pressEnterToContinue();
    })
    .then(() => listClient());
}

/**
 * Function to filter clients by race
 */
export function filterClientByRace(): void {
  displayTitle("Filter by Race");
  inquirer
    .prompt([
      {
        type: "list",
        name: "race",
        message: "Select the race of the client:",
        choices: validRaces,
      },
    ])
    .then((answers) => {
      const filteredClients = clientDB.getClientByRace(answers.race);

      console.clear();
      displayTitle("Filtered Clients");

      if (filteredClients.length === 0) {
        console.log(chalk.yellow("No clients found for this race."));
      } else {
        console.log(chalk.green("Matching Clients:"));
        console.table(
          filteredClients.map((client) => ({
            ID: client.id,
            Name: client.name,
            Race: client.race,
            Location: client.location,
          })),
        );
      }

      return pressEnterToContinue();
    })
    .then(() => listClient());
}

/**
 * Function to filter clients by location
 */
export function filterClientByLocation(): void {
  displayTitle("Filter by Location");
  inquirer
    .prompt([
      {
        type: "input",
        name: "location",
        message: "Enter the location of the client to filter:",
      },
    ])
    .then((answers) => {
      const filteredClients = clientDB.getClientByLocation(answers.location);

      console.clear();
      displayTitle("Filtered Clients");

      if (filteredClients.length === 0) {
        console.log(chalk.yellow("No clients found in that location."));
      } else {
        console.log(chalk.green("Matching Clients:"));
        console.table(
          filteredClients.map((client) => ({
            ID: client.id,
            Name: client.name,
            Race: client.race,
            Location: client.location,
          })),
        );
      }

      return pressEnterToContinue();
    })
    .then(() => listClient());
}
