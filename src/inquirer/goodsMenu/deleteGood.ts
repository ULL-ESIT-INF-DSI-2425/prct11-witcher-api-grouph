import inquirer from "inquirer";
import { displayTitle, pressEnterToContinue, showSuccess } from "../utils/menuUtils.js";
import { goodsMenu, itemDB } from "./goodsMenu.js";

/**
 * Function to delete a good from the database
 */
export function deleteGood(): void {
  displayTitle("Delete Good");
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter the item's ID:",
      },
    ])
    .then((answers) => {
      itemDB.removeItem(answers.id);
      showSuccess(`Item with ID ${answers.id} deleted successfully!`);
      pressEnterToContinue().then(() => goodsMenu());
    });
}
