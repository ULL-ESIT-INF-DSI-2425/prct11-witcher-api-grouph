import inquirer from "inquirer";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
  showSuccess,
} from "../utils/menuUtils.js";
import { goodsMenu, itemDB, validArmorMaterial, validPotionMaterial, validWeaponMaterial } from "./goodsMenu.js";
import { Armor, Weapon, Potion } from "../../item.js";

/**
 * Function to add a good to the database
 */
export function addGood(): void {
  displayTitle("Add Good");

  inquirer
    .prompt([
      {
        type: "list",
        name: "object",
        message: "Select the item's type:",
        choices: ["Potion", "Armor", "Weapon"],
        filter: (input) => input.toLowerCase(),
      },
      {
        type: "input",
        name: "name",
        message: "Enter the item's name:",
        filter: (input) => input.trim(),
      },
      {
        type: "input",
        name: "description",
        message: "Enter the item's description:",
        filter: (input) => input.trim(),
      },
      {
        type: "list",
        name: "material",
        message: "Select the item's material:",
        choices: (answers) => {
          switch (answers.object) {
            case "potion":
              return validPotionMaterial;
            case "armor":
              return validArmorMaterial;
            case "weapon":
              return validWeaponMaterial;
            default:
              return [];
          }
        },
        loop: false,
      },
      {
        type: "input",
        name: "weight",
        message: "Enter the item's weight (kg):",
        validate: (input) =>
          !isNaN(parseFloat(input)) && parseFloat(input) > 0
            ? true
            : "Weight must be a positive number.",
        filter: (input) => parseFloat(input),
      },
      {
        type: "input",
        name: "price",
        message: "Enter the item's price:",
        validate: (input) =>
          !isNaN(parseFloat(input)) && parseFloat(input) > 0
            ? true
            : "Price must be a positive number.",
        filter: (input) => parseFloat(input),
      },
    ])
    .then((answers) => {
      try {
        const newId = Date.now();

        let newItem;

        switch (answers.object) {
          case "potion":
            newItem = Potion.createPotion(
              newId,
              answers.name,
              answers.description,
              answers.material,
              answers.weight,
              answers.price,
              "None"
            );
            break;
          case "armor":
            newItem = Armor.createArmor(
              newId,
              answers.name,
              answers.description,
              answers.material,
              answers.weight,
              answers.price
            );
            break;
          case "weapon":
            newItem = Weapon.createWeapon(
              newId,
              answers.name,
              answers.description,
              answers.material,
              answers.weight,
              answers.price
            );
            break;
          default:
            return showError("Invalid item type.");
        }
        itemDB.addItem(newItem);
        showSuccess(`Item "${answers.name}" added successfully! ID: ${newId}`);
      } catch (error) {
        console.error("An error occurred while adding the item:", error);
        pressEnterToContinue().then(() => goodsMenu());
      }
      pressEnterToContinue().then(() => goodsMenu());
    });
}
