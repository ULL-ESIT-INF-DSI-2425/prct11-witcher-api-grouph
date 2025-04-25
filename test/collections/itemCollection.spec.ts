import { describe, expect, test, beforeEach } from "vitest";
import { ItemCollection } from "../../src/collections/itemCollection";
import { Armor, Weapon, Potion } from "../../src/item";

describe("ItemCollection class", () => {
  let itemCollection: ItemCollection;

  beforeEach(() => {
    itemCollection = new ItemCollection(() => {
      throw new Error("createItem should not be called directly in tests");
    });

    // Add some initial items for testing
    itemCollection.addItem(
      new Armor(
        "A-1",
        "Dragon Scale Armor",
        "Strong and durable",
        "Dragon Scales",
        15,
        500,
      ),
    );
    itemCollection.addItem(
      new Weapon(
        "W-1",
        "Silver Sword",
        "Effective against monsters",
        "Silver",
        8,
        300,
      ),
    );
    itemCollection.addItem(
      new Potion(
        "P-1",
        "Swallow",
        "Restores vitality",
        "Celandine Flower",
        0.5,
        50,
        "Vitality Regeneration",
      ),
    );
  });

  describe("addItem", () => {
    test("should add a new item to the collection", () => {
      const newItem = new Armor(
        "A-2",
        "Leather Armor",
        "Light and flexible",
        "Leather",
        5,
        100,
      );
      itemCollection.addItem(newItem);
      expect(itemCollection.getItems()).toHaveLength(4);
      expect(itemCollection.getItemBy("id", "A-2")).toHaveLength(1);
    });

    test("should not add an item with a duplicate ID", () => {
      const newItem = new Armor(
        "A-1",
        "Duplicate Armor",
        "Duplicate",
        "Leather",
        5,
        100,
      );
      itemCollection.addItem(newItem);
      expect(itemCollection.getItems()).toHaveLength(3); // No new item added
    });
  });

  describe("removeItem", () => {
    test("should remove an item by ID", () => {
      itemCollection.removeItem("A-1");
      expect(itemCollection.getItems()).toHaveLength(2);
      expect(itemCollection.getItemBy("id", "A-1")).toHaveLength(0);
    });

    test("should do nothing if the item ID does not exist", () => {
      itemCollection.removeItem("I-999");
      expect(itemCollection.getItems()).toHaveLength(3);
    });
  });

  describe("getItems", () => {
    test("should return all items in the collection", () => {
      const items = itemCollection.getItems();
      expect(items).toHaveLength(3);
      expect(items[0].id).toBe("A-1");
      expect(items[1].id).toBe("W-1");
      expect(items[2].id).toBe("P-1");
    });
  });

  describe("modifyItem", () => {
    test("should modify an item's name", () => {
      itemCollection.modifyItem("A-1", "name", "Reinforced Dragon Scale Armor");
      const modifiedItem = itemCollection.getItemBy("id", "A-1")[0];
      expect(modifiedItem.name).toBe("Reinforced Dragon Scale Armor");
    });

    test("should modify an item's price", () => {
      itemCollection.modifyItem("W-1", "price", 350);
      const modifiedItem = itemCollection.getItemBy("id", "W-1")[0];
      expect(modifiedItem.price).toBe(350);
    });

    test("should do nothing if the item ID does not exist", () => {
      itemCollection.modifyItem("I-999", "name", "Unknown");
      expect(itemCollection.getItems()).toHaveLength(3);
    });
  });

  describe("getItemBy", () => {
    test("should get items by ID", () => {
      const items = itemCollection.getItemBy("id", "A-1");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("A-1");
    });

    test("should get items by material", () => {
      const items = itemCollection.getItemBy("material", "Silver");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("W-1");
    });

    test("should return an empty array if no items match the criteria", () => {
      const items = itemCollection.getItemBy("name", "Unknown");
      expect(items).toHaveLength(0);
    });
  });

  describe("getItemsByName", () => {
    test("should get items by name", () => {
      const items = itemCollection.getItemsByName("Sword");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("W-1");
    });

    test("should return an empty array if no items match the name", () => {
      const items = itemCollection.getItemsByName("Unknown");
      expect(items).toHaveLength(0);
    });
  });

  describe("getItemsByType", () => {
    test("should get items by type (Armor)", () => {
      const items = itemCollection.getItemsByType("Armor");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("A-1");
    });

    test("should get items by type (Weapon)", () => {
      const items = itemCollection.getItemsByType("Weapon");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("W-1");
    });

    test("should get items by type (Potion)", () => {
      const items = itemCollection.getItemsByType("Potion");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("P-1");
    });
  });

  describe("getItemsByDescription", () => {
    test("should get items by description", () => {
      const items = itemCollection.getItemsByDescription("monsters");
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("W-1");
    });

    test("should return an empty array if no items match the description", () => {
      const items = itemCollection.getItemsByDescription("Unknown");
      expect(items).toHaveLength(0);
    });
  });

  describe("sortItemsByName", () => {
    test("should sort items by name in ascending order", () => {
      const sortedItems = itemCollection.sortItemsByName(true);
      expect(sortedItems[0].name).toBe("Dragon Scale Armor");
      expect(sortedItems[1].name).toBe("Silver Sword");
      expect(sortedItems[2].name).toBe("Swallow");
    });

    test("should sort items by name in descending order", () => {
      const sortedItems = itemCollection.sortItemsByName(false);
      expect(sortedItems[0].name).toBe("Swallow");
      expect(sortedItems[1].name).toBe("Silver Sword");
      expect(sortedItems[2].name).toBe("Dragon Scale Armor");
    });
  });

  describe("sortItemsByPrice", () => {
    test("should sort items by price in ascending order", () => {
      const sortedItems = itemCollection.sortItemsByPrice(true);
      expect(sortedItems[0].price).toBe(50);
      expect(sortedItems[1].price).toBe(300);
      expect(sortedItems[2].price).toBe(500);
    });

    test("should sort items by price in descending order", () => {
      const sortedItems = itemCollection.sortItemsByPrice(false);
      expect(sortedItems[0].price).toBe(500);
      expect(sortedItems[1].price).toBe(300);
      expect(sortedItems[2].price).toBe(50);
    });
  });
});
