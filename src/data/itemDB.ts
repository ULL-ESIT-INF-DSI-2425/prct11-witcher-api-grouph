import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import {
  BaseItem,
  Armor,
  Weapon,
  Potion,
  ArmorMaterial,
  GenericMaterial,
  PotionMaterial,
  WeaponMaterial,
} from "../item.js";
import { ItemCollection } from "../collections/itemCollection.js";

/**
 * Schema for the item database
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemDataBaseSchema = { items: any[] };

/**
 * Class to manage a collection of items
 */
export class JsonItemCollection extends ItemCollection {
  private database: LowSync<ItemDataBaseSchema>;

  /**
   * Constructor for the JsonItemCollection class
   * @param dbFilePath Path to the database file (optional)
   */
  constructor(dbFilePath: string = "Itemdb.json") {
    super((id, name, description, material, weight, price) => {
      if (!id || typeof id !== "string") {
        throw new Error(`Invalid ID: ${id}`);
      }
      if (id.startsWith("A-")) {
        return new Armor(
          id,
          name,
          description,
          material as ArmorMaterial,
          weight,
          price,
        );
      } else if (id.startsWith("W-")) {
        return new Weapon(
          id,
          name,
          description,
          material as WeaponMaterial,
          weight,
          price,
        );
      } else if (id.startsWith("P-")) {
        return new Potion(
          id,
          name,
          description,
          material as PotionMaterial,
          weight,
          price,
          "Unknown Effect",
        );
      } else {
        throw new Error(`Unknown item type for ID: ${id}`);
      }
    });

    const adapter = new JSONFileSync<ItemDataBaseSchema>(dbFilePath);
    this.database = new LowSync(adapter, { items: [] });
    this.database.read();
    if (!this.database.data || !Array.isArray(this.database.data.items)) {
      console.log("📂 Item database was empty. Initializing...");
      this.database.data = { items: [] };
      this.database.write();
    }
    this.items = this.database.data.items
      .filter((i) => i && Object.keys(i).length > 0 && i.id)
      .map((i) => {
        try {
          return this.createItem(
            i.id,
            i.name,
            i.description,
            i.material,
            i.weight,
            i.price,
          );
        } catch (error) {
          console.error(`Error creating item with ID ${i.id}:`, error);
          return null;
        }
      })
      .filter((i) => i !== null);

    console.log("📂 Item database loaded with", this.items.length, "items.");
  }

  /**
   * Saves the current state of the database.
   */
  private saveDatabase(): void {
    this.database.read();
    this.database.data.items = this.items.map((item) =>
      typeof item.toJSON === "function" ? item.toJSON() : item,
    );
    this.database.write();
  }

  /**
   * Adds a new item to the collection.
   * @param newItem The new item to add.
   */
  addItem(newItem: BaseItem): void {
    this.database.read();
    super.addItem(newItem);
    this.saveDatabase();
  }

  /**
   * Removes an item from the collection.
   * @param removeId The ID of the item to remove.
   */
  removeItem(removeId: string): void {
    this.database.read();
    super.removeItem(removeId);
    this.saveDatabase();
  }

  /**
   * Modifies an item's information.
   * @param modifyId The ID of the item to modify.
   * @param parameter The field to modify.
   * @param newValue The new value for the field.
   */
  modifyItem(
    modifyId: string,
    parameter: keyof BaseItem,
    newValue: string | GenericMaterial | number,
  ): void {
    this.database.read();
    super.modifyItem(modifyId, parameter, newValue);
    this.saveDatabase();
  }

  /**
   * Returns all items in the collection.
   * @returns An array of all items.
   */
  getAll(): BaseItem[] {
    return this.items;
  }
}
