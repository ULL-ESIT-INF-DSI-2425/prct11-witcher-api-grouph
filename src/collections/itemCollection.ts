import { BaseItem, Armor, Weapon, Potion, GenericMaterial } from "../item.js";

/**
 * Class to manage a collection of items
 */
export class ItemCollection {
  protected items: BaseItem[] = [];

  /**
   * Constructor for the ItemCollection class
   * @param createItem - Function to create a new item
   */
  constructor(
    protected createItem: (
      id: string,
      name: string,
      description: string,
      material: GenericMaterial,
      weight: number,
      price: number,
    ) => BaseItem,
  ) {}

  /**
   * Method to add a new item to the collection
   * @param newItem The new item to add
   * @returns void
   */
  addItem(newItem: BaseItem): void {
    if (this.items.some((i) => i.id === newItem.id)) {
      console.log(`/// WARNING: Item with ID ${newItem.id} already exists ///`);
      return;
    }
    this.items.push(newItem);
  }

  /**
   * Method to remove an item from the collection
   * @param removeId The id of the item to remove
   * @returns void
   */
  removeItem(removeId: string): void {
    this.items = this.items.filter((i) => i.id !== removeId);
  }

  /**
   * Method to get all items
   * @returns All items in the collection
   */
  getItems(): BaseItem[] {
    return this.items;
  }

  /**
   * Method to modify an item's information
   * @param modifyId The id of the item to modify
   * @param parameter The parameter to modify
   * @param newValue The new value for the parameter
   * @returns void
   */
  modifyItem(
    modifyId: string,
    parameter: keyof BaseItem,
    newValue: string | GenericMaterial | number,
  ): void {
    const item = this.items.find((i) => i.id === modifyId);
    if (item) {
      item[parameter] = newValue as never;
    } else {
      console.log(`/// WARNING: Item with ID ${modifyId} not found ///`);
    }
  }

  /**
   * Nethod that print the result of the search in a formatted way
   * @param title title of the search
   * @param items items that are going to be printed
   */
  private printFormatted(title: string, items: BaseItem[]): void {
    console.log(`\n=== ${title} ===`);
    if (items.length === 0) {
      console.log("No items found.");
    } else {
      console.table(
        items.map((item) => ({
          ID: item.id,
          Name: item.name,
          Description: item.description,
          Material: item.material,
          Weight: item.weight,
          Price: item.price,
        })),
      );
    }
  }

  /**
   * Method to get an item by a specific parameter
   * @param parameter The parameter to search by
   * @param value The value to search for
   * @returns The item(s) that match the search
   */
  getItemBy(
    parameter: keyof BaseItem,
    value: string | GenericMaterial | number,
  ): BaseItem[] {
    const result = this.items.filter((i) => i[parameter] === value);
    this.printFormatted(`Items filtered by ${parameter} = ${value}`, result);
    return result;
  }

  getItemById(id: string): BaseItem | undefined {
    return this.items.find((i) => i.id === id);
  }
  /**
   * Method to get an item by its id
   * @param id The id of the item to search for
   * @returns The item that matches the id
   */
  getItemsByName(name: string): BaseItem[] {
    const result = this.items.filter((i) =>
      i.name.toLowerCase().includes(name.toLowerCase()),
    );
    this.printFormatted(`Items filtered by name including "${name}"`, result);
    return result;
  }

  /**
   * Method to get items by type
   * @param type The type of item to search for
   * @returns the items that match the type
   */
  getItemsByType(type: "Armor" | "Weapon" | "Potion"): BaseItem[] {
    const result = this.items.filter((i) => {
      if (type === "Armor") return i instanceof Armor;
      if (type === "Weapon") return i instanceof Weapon;
      if (type === "Potion") return i instanceof Potion;
      return false;
    });
    this.printFormatted(`Items filtered by type "${type}"`, result);
    return result;
  }

  /**
   * Method to get items by material
   * @param material The material of the item to search for
   * @returns The items that match the material
   */
  getItemsByDescription(description: string): BaseItem[] {
    const result = this.items.filter((i) =>
      i.description.toLowerCase().includes(description.toLowerCase()),
    );
    this.printFormatted(
      `Items filtered by description including "${description}"`,
      result,
    );
    return result;
  }

  /**
   * Method to get items by material
   * @param material The material of the item to search for
   * @returns The items that match the material
   */
  sortItemsByName(ascending: boolean = true): BaseItem[] {
    const result = this.items.slice().sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return ascending ? comparison : -comparison;
    });
    this.printFormatted(
      `Items sorted by name ${ascending ? "ascending" : "descending"}`,
      result,
    );
    return result;
  }

  /**
   * Method to sort items by weight
   * @param ascending Whether to sort in ascending order (true) or descending (false)
   * @returns The sorted items
   */
  sortItemsByPrice(ascending: boolean = true): BaseItem[] {
    const result = this.items.slice().sort((a, b) => {
      const comparison = a.price - b.price;
      return ascending ? comparison : -comparison;
    });
    this.printFormatted(
      `Items sorted by price ${ascending ? "ascending" : "descending"}`,
      result,
    );
    return result;
  }

  /**
   * Method to get all items
   * @returns void
   */
  getAllItems(): void {
    console.table(
      this.items.map((item) => ({
        ID: item.id,
        Name: item.name,
        Description: item.description,
        Material: item.material,
        Weight: item.weight,
        Price: item.price,
      })),
    );
  }
}
