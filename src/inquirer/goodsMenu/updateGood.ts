import inquirer from "inquirer";
import {
  displayTitle,
  pressEnterToContinue,
  showSuccess,
  showError,
} from "../utils/menuUtils.js";
import { goodsMenu, itemDB, validArmorMaterial, validPotionMaterial, validWeaponMaterial } from "./goodsMenu.js";

/**
 * Function to update a good in the database
 */
export function updateGood(): void {
  displayTitle("Update Good");

  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the item's ID:",
      },
    ])
    .then((answer) => {
      const item = itemDB.getItemById(answer.id);
      if (!item) {
        showError("Item not found.");
        return;
      }

      inquirer
        .prompt([
          {
            type: "list",
            name: "field",
            message: "Select the field to update:",
            choices: [
              { name: "Name", value: "name" },
              { name: "Description", value: "description" },
              { name: "Material", value: "material" },
              { name: "Weight", value: "weight" },
              { name: "Price", value: "price" },
            ],
            loop: false,
          },
        ])
        .then(({ field }) => {
          let promptConfig: any;

          if (field === "material") {
            promptConfig = {
              type: "list",
              name: "value",
              message: "Select the new material:",
              choices: (() => {
                switch (item.id[0]) {
                  case "P":
                    return validPotionMaterial;
                  case "A":
                    return validArmorMaterial;
                  case "W":
                    return validWeaponMaterial;
                  default:
                    return [];
                }
              })(),
              loop: false,
            };
          } else {
            promptConfig = {
              type: "input",
              name: "value",
              message: `Enter the new ${field}:`,
              validate: (input: string): boolean | string => {
                if (field === "weight" || field === "price") {
                  return !isNaN(parseFloat(input)) && parseFloat(input) > 0
                    ? true
                    : `${field} must be a positive number`;
                }
                return input.trim().length > 0 ? true : "This field cannot be empty";
              },
              filter: (input: string): string | number =>
                field === "weight" || field === "price" ? parseFloat(input) : input,
            };
          }

          inquirer.prompt([promptConfig]).then((answers) => {
            itemDB.modifyItem(answer.id, field, answers.value);
            showSuccess(`Item ${field} updated successfully!`);
            pressEnterToContinue().then(() => goodsMenu());
          });
        });
    });
}
