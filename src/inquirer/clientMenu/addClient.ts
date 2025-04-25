import inquirer from "inquirer";
import { displayTitle, pressEnterToContinue, showSuccess } from "../utils/menuUtils.js";
import { clientDB, clientMenu, validRaces } from "./clientMenu.js";
import { Hunter, Race } from "../../hunter.js";

/**
 * Function to add a client to the database
 */
export function addClient(): void {
  displayTitle("Add Client");
  inquirer
    .prompt([
      { type: "input", name: "name", message: "Enter the client's name:" },
      {
        type: "input",
        name: "race",
        message: "Enter the client's race:",
        validate: (input) => {
          const trimmedInput = input.trim() as Race;
          return validRaces.includes(trimmedInput)
            ? true
            : `Invalid race. Choose form ${validRaces.join(", ")}.`;
        },
      },

      {
        type: "input",
        name: "address",
        message: "Enter the client's address:",
      },
    ])
    .then((answers) => {
      const newId = Date.now();
      const newHunter = Hunter.createHunter(
        newId,
        answers.name,
        answers.race,
        answers.address,
      );

      clientDB.addClient(newHunter);
      showSuccess(`Client "${answers.name}" added successfully!`);
      pressEnterToContinue().then(() => clientMenu());
    });
}
