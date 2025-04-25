import { describe, expect, test, beforeEach, expectTypeOf } from "vitest";
import { Inventory } from "../../src/inventory.js";
import { Item, Armor, Weapon } from "../../src/item.js";
import { Hunter } from "../../src/hunter.js";
import { Merchant } from "../../src/merchant.js";
import { ClientCollection } from "../../src/collections/clientCollection.js";
import { MerchantCollection } from "../../src/collections/merchantCollection.js";
import { ItemCollection } from "../../src/collections/itemCollection.js";

describe("Inventory class tests", () => {
  let inventory: Inventory;
  let clientCollection: ClientCollection;
  let merchantCollection: MerchantCollection;
  let itemCollection: ItemCollection;
  let item1: Item;
  let item2: Item;
  let client: Hunter;
  let merchant: Merchant;

  beforeEach(() => {
    clientCollection = new ClientCollection();
    merchantCollection = new MerchantCollection();
    itemCollection = new ItemCollection();
    inventory = new Inventory(
      clientCollection,
      merchantCollection,
      itemCollection,
    );

    // Instantiate items
    item1 = new Armor(
      "A-001",
      "Dragon Scale Armor",
      "Strong and durable",
      "Dragon Scales",
      15,
      500,
    );
    item2 = new Weapon(
      "W-001",
      "Silver Sword",
      "Effective against monsters",
      "Silver",
      8,
      300,
    );

    // Instantiate client and merchant
    client = Hunter.createHunter(1, "Geralt of Rivia", "Human", "Kaer Morhen");
    merchant = Merchant.createMerchant(1, "Hattori", "Blacksmith", "Novigrad");

    // Add to collections
    clientCollection.addClient(client);
    merchantCollection.addMerchant(merchant);
    itemCollection.addItem(item1);
    itemCollection.addItem(item2);
  });

  describe("Stock management", () => {
    test("should add an item to the stock", () => {
      inventory.addItemToStock(item1, 10);
      expect(inventory.getStockLevel(item1)).toBe(10);
    });

    test("should throw an error when adding an item with quantity <= 0", () => {
      expect(() => inventory.addItemToStock(item1, 0)).toThrowError(
        "Quantity must be greater than 0 for item: Dragon Scale Armor",
      );
    });

    test("should remove an item from the stock", () => {
      inventory.addItemToStock(item1, 10);
      inventory.removeItemFromStock(item1, 5);
      expect(inventory.getStockLevel(item1)).toBe(5);
    });

    test("should throw an error when removing more items than available", () => {
      inventory.addItemToStock(item1, 5);
      expect(() => inventory.removeItemFromStock(item1, 10)).toThrowError(
        "Not enough stock for item: Dragon Scale Armor",
      );
    });

    test("should delete the stock record when quantity reaches 0", () => {
      inventory.addItemToStock(item1, 5);
      inventory.removeItemFromStock(item1, 5);
      expect(inventory.getStockLevel(item1)).toBe(0);
    });
  });

  describe("Transaction management", () => {
    test("should record a sale transaction", () => {
      inventory.addItemToStock(item1, 10);
      inventory.recordSale(client, [item1]);
      expect(inventory.getSales().length).toBe(1);
      expect(inventory.getStockLevel(item1)).toBe(9);
    });

    test("should throw an error when recording a sale for a non-existent client", () => {
      const invalidClient = Hunter.createHunter(
        999,
        "Invalid",
        "Human",
        "Nowhere",
      );
      expect(() => inventory.recordSale(invalidClient, [item1])).toThrowError(
        "Client with ID H-999 does not exist.",
      );
    });

    test("should record a purchase transaction", () => {
      inventory.recordPurchase(merchant, [item1]);
      expect(inventory.getPurchases().length).toBe(1);
      expect(inventory.getStockLevel(item1)).toBe(1);
    });

    test("should throw an error when recording a purchase for a non-existent merchant", () => {
      const invalidMerchant = Merchant.createMerchant(
        999,
        "Invalid",
        "Butcher",
        "Nowhere",
      );
      expect(() =>
        inventory.recordPurchase(invalidMerchant, [item1]),
      ).toThrowError("Merchant with ID M-999 does not exist.");
    });

    test("should record a return transaction from a client", () => {
      inventory.addItemToStock(item1, 10);
      inventory.recordReturn(client, [item1], "Defective");
      expect(inventory.getReturns().length).toBe(1);
      expect(inventory.getStockLevel(item1)).toBe(11);
    });

    test("should record a return transaction from a merchant", () => {
      inventory.addItemToStock(item1, 10);
      inventory.recordReturn(merchant, [item1], "Defective");
      expect(inventory.getReturns().length).toBe(1);
      expect(inventory.getStockLevel(item1)).toBe(9);
    });
  });

  describe("Transaction queries", () => {
    beforeEach(() => {
      inventory.addItemToStock(item1, 10);
      inventory.addItemToStock(item2, 5);
      inventory.recordSale(client, [item1, item2]);
      inventory.recordPurchase(merchant, [item1]);
      inventory.recordReturn(client, [item2], "Defective");
    });

    test("should get all transactions", () => {
      expect(inventory.getAllTransactions().length).toBe(3);
    });

    test("should get all sales", () => {
      expect(inventory.getSales().length).toBe(1);
    });

    test("should get all purchases", () => {
      expect(inventory.getPurchases().length).toBe(1);
    });

    test("should get all returns", () => {
      expect(inventory.getReturns().length).toBe(1);
    });

    test("should get transactions by item", () => {
      expect(inventory.getTransactionsByItem(item1).length).toBe(2);
    });

    test("should get transactions by date", () => {
      const date = new Date();
      expect(inventory.getTransactionsByDate(date).length).toBe(3);
    });

    test("should get client returns", () => {
      expect(inventory.getClientReturns().length).toBe(1);
    });

    test("should get merchant returns", () => {
      expect(inventory.getMerchantReturns().length).toBe(0);
    });
  });

  describe("Crowns calculations", () => {
    beforeEach(() => {
      inventory.addItemToStock(item1, 10);
      inventory.addItemToStock(item2, 5);
      inventory.recordSale(client, [item1, item2]);
      inventory.recordPurchase(merchant, [item1]);
      inventory.recordReturn(client, [item2], "Defective");
    });

    test("should calculate earned crowns from sales", () => {
      expect(inventory.getEarnedCrownsbySales()).toBe(800); // 500 (item1) + 300 (item2)
    });

    test("should calculate spent crowns from purchases", () => {
      expect(inventory.getSpentCrownsbyPurchases()).toBe(500); // 500 (item1)
    });

    test("should calculate returned crowns", () => {
      expect(inventory.getReturnedCrowns()).toBe(300); // 300 (item2)
    });

    test("should calculate net crowns", () => {
      expect(inventory.getNetCrowns()).toBe(600);
    });
  });

  describe("Type checks", () => {
    test("should have the correct methods", () => {
      expectTypeOf(inventory).toHaveProperty("addItemToStock");
      expectTypeOf(inventory).toHaveProperty("removeItemFromStock");
      expectTypeOf(inventory).toHaveProperty("recordSale");
      expectTypeOf(inventory).toHaveProperty("recordPurchase");
      expectTypeOf(inventory).toHaveProperty("recordReturn");
      expectTypeOf(inventory).toHaveProperty("getAllTransactions");
    });
  });
});
