import inquirer from "inquirer";
import chalk from "chalk";
import {
  displayTitle,
  pressEnterToContinue,
  showError,
} from "../utils/menuUtils.js";
import { mainMenu } from "../mainMenu.js";
import { addGood } from "./addGood.js";
import { deleteGood } from "./deleteGood.js";
import { updateGood } from "./updateGood.js";
import { goodList } from "./goodList.js";
import { JsonItemCollection } from "../../data/itemDB.js";
import { ArmorMaterial, PotionMaterial, WeaponMaterial } from "../../item.js";

/**
 * Instance of the JsonItemCollection class
 */
export const itemDB = new JsonItemCollection();

export const validWeaponMaterial: WeaponMaterial[] = [
  "Steel",
  "Elven Steel",
  "Meteoric Steel",
  "Silver",
  "Reinforced Silver",
  "Ebony Wood",
  "Monster Bone",
  "Volcanic Glass",
  "Mithril",
  "Adamantite",
] as const;

export const validArmorMaterial: ArmorMaterial[] = [
  "Leather",
  "Hardened Leather",
  "Steel Mesh",
  "Silver Mesh",
  "Dragon Scales",
  "Adamantite Plates",
  "Mithril",
  "Enchanted Fabric",
  "Monster Bone",
  "Insectoid Chitin",
] as const;

export const validPotionMaterial: PotionMaterial[] = [
  "Celandine Flower",
  "Mandrake",
  "Vervain",
  "Bryonia Root",
  "Crushed Kikimora Skull",
  "Nekker Gland",
  "Wraith Essence",
  "Griffin Marrow",
  "Endrega Mucus",
  "Ghoul Blood",
] as const;

export function goodsMenu(): void {
  displayTitle("Manage Goods");
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: chalk.white.underline("► Select an option:"),
        choices: [
          { name: chalk.green("Add Good"), value: "add" },
          { name: chalk.red("Delete Good"), value: "delete" },
          { name: chalk.blue("Update Good"), value: "update" },
          { name: chalk.magenta("Inventory Status"), value: "list" },
          new inquirer.Separator(),
          { name: chalk.yellow("↩ Return to Main Menu"), value: "back" },
        ],
      },
    ])
    .then((answers) => {
      const action = answers.option as string;
      if (action === "back") return mainMenu();

      switch (action) {
        case "add":
          return addGood();
        case "delete":
          return deleteGood();
        case "update":
          return updateGood();
        case "list":
          return goodList();
        default:
          showError("Invalid action");
      }
      pressEnterToContinue().then(() => goodsMenu());
    });
}
