import inquirer from "inquirer";
import { displayTitle, pressEnterToContinue, showSuccess } from "../utils/menuUtils.js";
import { merchantMenu, merchantDB } from "./merchantMenu.js";
import { Profession } from "../../merchant.js"; // Importa Profession si es un enum o type

/**
 * List of valid professions for merchants.
 */
const validProfessions: Profession[] = [
  "Blacksmith",
  "Alchemist",
  "General Merchant",
  "Butcher",
  "Druid",
  "Smuggler",
] as const;

/**
 * Inquirer prompt to update a merchant in the database.
 */
export function updateMerchant(): void {
  displayTitle("Update Merchant");
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the Merchant's ID:",
      },
    ])
    .then((answer) => {
      console.log("Update Merchant function pending...");
      inquirer
        .prompt([
          {
            type: "list",
            name: "field",
            message: "Select the field to update:",
            choices: [
              { name: "Name", value: "name" },
              { name: "Profession", value: "profession" },
              { name: "Address", value: "address" },
            ],
          },
        ])
        .then(({ field }) => {
          inquirer
            .prompt([
              {
                type: "input",
                name: "value",
                message: `Enter the new ${field}:`,
                validate: (input) => {
                  const trimmedInput = input.trim() as Profession;
                  if (field === "profession") {
                    return validProfessions.includes(trimmedInput)
                      ? true
                      : `Invalid profession. Choose from: ${validProfessions.join(", ")}.`;
                  }
                  return true;
                },
              },
            ])
            .then((answers) => {
              merchantDB.modifyMerchant(answer.id, field, answers.value);
              showSuccess(`Merchant with ID ${answer.id} updated successfully!`);
              pressEnterToContinue().then(() => merchantMenu());
            });
        });
    });
}
