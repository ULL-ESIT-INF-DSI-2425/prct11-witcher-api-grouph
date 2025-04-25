import inquirer from "inquirer";
import chalk from "chalk";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
  showSuccess,
} from "../utils/menuUtils.js";
import { mainMenu } from "../mainMenu.js";
import { Inventory } from "../../inventory.js";
import { Item, Potion, Armor, Weapon } from "../../item.js";
import { clientDB } from "../../inquirer/clientMenu/clientMenu.js";
import { merchantDB } from "../../inquirer/merchantMenu/merchantMenu.js";
import { itemDB } from "../../inquirer/goodsMenu/goodsMenu.js";

const clientCollection = clientDB;
const itemCollection = itemDB;
const merchantCollection = merchantDB;

/**
 * Inventory instance to manage transactions.
 */
export const inventory = new Inventory(
  clientCollection,
  merchantCollection,
  itemCollection,
);

/**
 * Inquirer prompt to manage transactions.
 */
export function transactionsMenu(): void {
  displayTitle("Transactions Menu");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.green("Buy from Merchant"), value: "buy" },
          { name: chalk.red("Sell to Client"), value: "sell" },
          { name: chalk.blue("Return Item"), value: "return" },
          new inquirer.Separator(),
          { name: chalk.yellow("↩ Return to Main Menu"), value: "back" },
        ],
      },
    ])
    .then((answers) => {
      const action = answers["option"] as string;
      if (action === "back") return mainMenu();

      switch (action) {
        case "buy":
          return buyGoods();
        case "sell":
          return sellGoods();
        case "return":
          return returnGoods();
        default:
          showError("Invalid action");
          return transactionsMenu();
      }
    });
}

/**
 * Inquirer prompt to buy goods from a merchant.
 */
function buyGoods(): void {
  inquirer
    .prompt([
      {
        type: "input",
        name: "merchantId",
        message: "Enter Merchant ID:",
      },
      {
        type: "input",
        name: "object",
        message: "Enter the item's type (Potion, Armor, Weapon):",
        validate: (input) => {
          const validTypes = ["potion", "armor", "weapon"];
          return validTypes.includes(input.trim().toLowerCase())
            ? true
            : "Invalid item type. Choose between Potion, Armor, or Weapon.";
        },
        filter: (input) => input.trim().toLowerCase(),
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
        type: "input",
        name: "material",
        message: "Enter the item's material:",
        filter: (input) => input.trim(),
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
      const merchant = merchantCollection.getMerchantById(answers.merchantId);
      if (!merchant) return showError("Merchant not found");

      let newItem;
      const newId = Date.now();

      switch (answers.object) {
        case "potion":
          newItem = Potion.createPotion(
            newId,
            answers.name,
            answers.description,
            answers.material,
            answers.weight,
            answers.price,
            "None",
          );
          break;
        case "armor":
          newItem = Armor.createArmor(
            newId,
            answers.name,
            answers.description,
            answers.material,
            answers.weight,
            answers.price,
          );
          break;
        case "weapon":
          newItem = Weapon.createWeapon(
            newId,
            answers.name,
            answers.description,
            answers.material,
            answers.weight,
            answers.price,
          );
          break;
        default:
          return showError("Invalid item type");
      }
      itemCollection.addItem(newItem);
      inventory.addItemToStock(newItem, 1);
      inventory.recordPurchase(merchant, [newItem]);
      showSuccess(`Item "${answers.name}" added successfully! ID: ${newId}`);
      pressEnterToContinue().then(() => transactionsMenu());
    });
}

/**
 * Inquirer prompt to sell goods to a client.
 */
function sellGoods(): void {
  displayTitle("Sell Good");
  inquirer
    .prompt([
      {
        type: "input",
        name: "clientId",
        message: "Enter Client ID:",
      },
      {
        type: "input",
        name: "itemId",
        message: "Enter the Item ID to sell:",
      },
    ])
    .then(({ clientId, itemId }) => {
      const client = clientCollection.getClientById(clientId);
      if (!client) return showError("Client not found");

      const item = itemCollection.getItemBy("id", itemId);
      if (!Array.isArray(item) || item.length === 0)
        return showError("Item not found");
      const selectedItem = item[0] as Item;

      if (inventory.getStockLevel(selectedItem) > 0) {
        inventory.recordSale(client, [selectedItem]);
        inventory.removeItemFromStock(selectedItem, 1);
        console.log(
          chalk.green(`✔ Item "${selectedItem.name}" sold successfully!`),
        );
      } else {
        return showError(`Not enough stock for item: ${selectedItem.name}`);
      }

      pressEnterToContinue().then(() => transactionsMenu());
    });
}

/**
 * Inquirer prompt to return an item to the merchant.
 */
function returnGoods(): void {
  displayTitle("Return Item");
  inquirer
    .prompt([
      {
        type: "input",
        name: "clientOrMerchantId",
        message: "Enter Client or Merchant ID:",
      },
      {
        type: "list",
        name: "object",
        message: "Enter the item's type (Potion, Armor, Weapon):",
        choices: ["potion", "armor", "weapon"],
      },
      {
        type: "input",
        name: "name",
        message: "Enter Item Name:",
      },
      {
        type: "input",
        name: "description",
        message: "Enter Item Description:",
      },
      {
        type: "input",
        name: "material",
        message: "Enter Item Material:",
      },
      {
        type: "input",
        name: "weight",
        message: "Enter Item Weight (kg):",
        validate: (value) =>
          !isNaN(Number(value)) && Number(value) > 0
            ? true
            : "Enter a valid positive number",
        filter: (input) => parseFloat(input),
      },
      {
        type: "input",
        name: "price",
        message: "Enter Item Price (crowns):",
        validate: (value) =>
          !isNaN(Number(value)) && Number(value) > 0
            ? true
            : "Enter a valid positive number",
        filter: (input) => parseFloat(input),
      },
      {
        type: "input",
        name: "reason",
        message: "Enter reason for return:",
      },
    ])
    .then(
      ({
        clientOrMerchantId,
        object,
        name,
        description,
        material,
        weight,
        price,
        reason,
      }) => {
        const entity =
          clientCollection.getClientById(clientOrMerchantId) ||
          merchantCollection.getMerchantById(clientOrMerchantId);
        if (!entity) return showError("Client or Merchant not found");

        let newItem;
        const newId = Date.now().toString();

        switch (object) {
          case "potion":
            newItem = new Potion(
              newId,
              name,
              description,
              material,
              weight,
              price,
              "None",
            );
            break;
          case "armor":
            newItem = new Armor(
              newId,
              name,
              description,
              material,
              weight,
              price,
            );
            break;
          case "weapon":
            newItem = new Weapon(
              newId,
              name,
              description,
              material,
              weight,
              price,
            );
            break;
          default:
            return showError("Invalid item type");
        }
        itemCollection.addItem(newItem);
        inventory.addItemToStock(newItem, 1);
        inventory.recordReturn(entity, [newItem], reason);
        showSuccess(`Item "${name}" returned successfully! ID: ${newId}`);
        pressEnterToContinue().then(() => transactionsMenu());
      },
    );
}
