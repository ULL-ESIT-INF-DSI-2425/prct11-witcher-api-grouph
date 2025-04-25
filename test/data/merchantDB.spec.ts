import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { JsonMerchantCollection } from "../../src/data/merchantDB";
import { Merchant } from "../../src/merchant";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import fs from "fs";

// Path to the test database file
const TEST_DB_FILE = "TestMerchantdb.json";

describe("JsonMerchantCollection class", () => {
  let jsonMerchantCollection: JsonMerchantCollection;

  beforeEach(() => {
    // Initialize the test database with an empty array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new JSONFileSync<{ merchants: any[] }>(TEST_DB_FILE);
    const db = new LowSync(adapter, { merchants: [] });
    db.data = { merchants: [] }; // Reset the database
    db.write();

    // Create a new instance of JsonMerchantCollection with the test database file
    jsonMerchantCollection = new JsonMerchantCollection(TEST_DB_FILE);
  });

  afterEach(() => {
    // Clean up the test database file after each test
    if (fs.existsSync(TEST_DB_FILE)) {
      fs.unlinkSync(TEST_DB_FILE);
    }
  });

  describe("addMerchant", () => {
    test("should add a new merchant to the collection", () => {
      const newMerchant = new Merchant(
        "M-1",
        "Hattori",
        "Blacksmith",
        "Novigrad",
      );
      jsonMerchantCollection.addMerchant(newMerchant);
      expect(jsonMerchantCollection.getMerchants()).toContainEqual(newMerchant);
    });

    test("should not add a merchant with a duplicate ID", () => {
      const newMerchant1 = new Merchant(
        "M-1",
        "Hattori",
        "Blacksmith",
        "Novigrad",
      );
      const newMerchant2 = new Merchant(
        "M-1",
        "Duplicate",
        "Blacksmith",
        "Novigrad",
      );
      jsonMerchantCollection.addMerchant(newMerchant1);
      jsonMerchantCollection.addMerchant(newMerchant2);
      expect(jsonMerchantCollection.getMerchants()).toHaveLength(1); // No new merchant added
    });

    test("should not add an invalid merchant", () => {
      const invalidMerchant = new Merchant("", "", "Blacksmith", ""); // Invalid merchant
      jsonMerchantCollection.addMerchant(invalidMerchant);
      expect(jsonMerchantCollection.getMerchants()).toHaveLength(0);
    });
  });

  describe("removeMerchant", () => {
    test("should remove a merchant by ID", () => {
      const newMerchant = new Merchant("M-2", "Keira", "Alchemist", "Velen");
      jsonMerchantCollection.addMerchant(newMerchant);
      jsonMerchantCollection.removeMerchant("M-2");
      expect(jsonMerchantCollection.getMerchants()).not.toContainEqual(
        newMerchant,
      );
    });

    test("should do nothing if the merchant ID does not exist", () => {
      const initialMerchants = jsonMerchantCollection.getMerchants();
      jsonMerchantCollection.removeMerchant("M-999");
      expect(jsonMerchantCollection.getMerchants()).toEqual(initialMerchants);
    });
  });

  describe("modifyMerchant", () => {
    test("should modify a merchant's name", () => {
      const newMerchant = new Merchant("M-3", "Otto", "Butcher", "Novigrad");
      jsonMerchantCollection.addMerchant(newMerchant);
      jsonMerchantCollection.modifyMerchant("M-3", "name", "Otto the Butcher");
      const modifiedMerchant = jsonMerchantCollection
        .getMerchants()
        .find((m) => m.id === "M-3");
      expect(modifiedMerchant?.name).toBe("Otto the Butcher");
    });

    test("should modify a merchant's profession", () => {
      const newMerchant = new Merchant(
        "M-4",
        "Ramis",
        "General Merchant",
        "Oxenfurt",
      );
      jsonMerchantCollection.addMerchant(newMerchant);
      jsonMerchantCollection.modifyMerchant("M-4", "profession", "Druid");
      const modifiedMerchant = jsonMerchantCollection
        .getMerchants()
        .find((m) => m.id === "M-4");
      expect(modifiedMerchant?.profession).toBe("Druid");
    });

    test("should modify a merchant's location", () => {
      const newMerchant = new Merchant("M-5", "Fergus", "Blacksmith", "Velen");
      jsonMerchantCollection.addMerchant(newMerchant);
      jsonMerchantCollection.modifyMerchant("M-5", "location", "Beauclair");
      const modifiedMerchant = jsonMerchantCollection
        .getMerchants()
        .find((m) => m.id === "M-5");
      expect(modifiedMerchant?.location).toBe("Beauclair");
    });

    test("should do nothing if the merchant ID does not exist", () => {
      const initialMerchants = jsonMerchantCollection.getMerchants();
      jsonMerchantCollection.modifyMerchant("M-999", "name", "Unknown");
      expect(jsonMerchantCollection.getMerchants()).toEqual(initialMerchants);
    });
  });

  describe("getMerchants", () => {
    test("should return all merchants in the collection", () => {
      const merchants = jsonMerchantCollection.getMerchants();
      expect(merchants).toBeInstanceOf(Array);
      expect(merchants.length).toBeGreaterThanOrEqual(0);
    });
  });
});
