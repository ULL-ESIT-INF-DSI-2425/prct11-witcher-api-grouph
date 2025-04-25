import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { JsonItemCollection } from "../../src/data/itemDB";
import { Armor, Weapon, Potion } from "../../src/item";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import fs from "fs";

// Path to the test database file
const TEST_DB_FILE = "TestItemdb.json";

describe("JsonItemCollection class", () => {
  let jsonItemCollection: JsonItemCollection;

  beforeEach(() => {
    // Initialize the test database with an empty array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new JSONFileSync<{ items: any[] }>(TEST_DB_FILE);
    const db = new LowSync(adapter, { items: [] });
    db.data = { items: [] }; // Reset the database
    db.write();

    // Create a new instance of JsonItemCollection with the test database file
    jsonItemCollection = new JsonItemCollection(TEST_DB_FILE);
  });

  afterEach(() => {
    // Clean up the test database file after each test
    if (fs.existsSync(TEST_DB_FILE)) {
      fs.unlinkSync(TEST_DB_FILE);
    }
  });

  describe("addItem", () => {
    test("should add a new item to the collection", () => {
      const newItem = new Armor(
        "A-1",
        "Dragon Scale Armor",
        "Strong and durable",
        "Dragon Scales",
        15,
        500,
      );
      jsonItemCollection.addItem(newItem);
      expect(jsonItemCollection.getAll()).toContainEqual(newItem);
    });

    test("should not add an item with a duplicate ID", () => {
      const newItem1 = new Armor(
        "A-1",
        "Dragon Scale Armor",
        "Strong and durable",
        "Dragon Scales",
        15,
        500,
      );
      const newItem2 = new Armor(
        "A-1",
        "Duplicate Armor",
        "Duplicate",
        "Dragon Scales",
        15,
        500,
      );
      jsonItemCollection.addItem(newItem1);
      jsonItemCollection.addItem(newItem2);
      expect(jsonItemCollection.getAll()).toHaveLength(1); // No new item added
    });
  });

  describe("removeItem", () => {
    test("should remove an item by ID", () => {
      const newItem = new Weapon(
        "W-1",
        "Silver Sword",
        "Effective against monsters",
        "Silver",
        8,
        300,
      );
      jsonItemCollection.addItem(newItem);
      jsonItemCollection.removeItem("W-1");
      expect(jsonItemCollection.getAll()).not.toContainEqual(newItem);
    });

    test("should do nothing if the item ID does not exist", () => {
      const initialItems = jsonItemCollection.getAll();
      jsonItemCollection.removeItem("I-999");
      expect(jsonItemCollection.getAll()).toEqual(initialItems);
    });
  });

  describe("modifyItem", () => {
    test("should modify an item's name", () => {
      const newItem = new Potion(
        "P-1",
        "Swallow",
        "Restores vitality",
        "Celandine Flower",
        0.5,
        50,
        "Vitality Regeneration",
      );
      jsonItemCollection.addItem(newItem);
      jsonItemCollection.modifyItem("P-1", "name", "Enhanced Swallow");
      const modifiedItem = jsonItemCollection
        .getAll()
        .find((i) => i.id === "P-1");
      expect(modifiedItem?.name).toBe("Enhanced Swallow");
    });

    test("should modify an item's price", () => {
      const newItem = new Armor(
        "A-2",
        "Leather Armor",
        "Light and flexible",
        "Leather",
        5,
        100,
      );
      jsonItemCollection.addItem(newItem);
      jsonItemCollection.modifyItem("A-2", "price", 150);
      const modifiedItem = jsonItemCollection
        .getAll()
        .find((i) => i.id === "A-2");
      expect(modifiedItem?.price).toBe(150);
    });

    test("should do nothing if the item ID does not exist", () => {
      const initialItems = jsonItemCollection.getAll();
      jsonItemCollection.modifyItem("I-999", "name", "Unknown");
      expect(jsonItemCollection.getAll()).toEqual(initialItems);
    });
  });

  describe("getAll", () => {
    test("should return all items in the collection", () => {
      const items = jsonItemCollection.getAll();
      expect(items).toBeInstanceOf(Array);
      expect(items.length).toBeGreaterThanOrEqual(0);
    });
  });
});
