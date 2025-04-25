import { describe, expect, test, beforeEach } from "vitest";
import { MerchantCollection } from "../../src/collections/merchantCollection";
import { Merchant } from "../../src/merchant";

describe("MerchantCollection class", () => {
  let merchantCollection: MerchantCollection;

  beforeEach(() => {
    merchantCollection = new MerchantCollection(() => {
      throw new Error("createMerchant should not be called directly in tests");
    });

    // Add some initial merchants for testing
    merchantCollection.addMerchant(
      new Merchant("M-1", "Hattori", "Blacksmith", "Novigrad"),
    );
    merchantCollection.addMerchant(
      new Merchant("M-2", "Keira", "Alchemist", "Velen"),
    );
    merchantCollection.addMerchant(
      new Merchant("M-3", "Otto", "Butcher", "Novigrad"),
    );
  });

  describe("addMerchant", () => {
    test("should add a new merchant to the collection", () => {
      const newMerchant = new Merchant(
        "M-4",
        "Ramis",
        "General Merchant",
        "Oxenfurt",
      );
      merchantCollection.addMerchant(newMerchant);
      expect(merchantCollection.getMerchants()).toHaveLength(4);
      expect(merchantCollection.getMerchantById("M-4")).toEqual(newMerchant);
    });

    test("should not add a merchant with a duplicate ID", () => {
      const newMerchant = new Merchant(
        "M-1",
        "Duplicate",
        "Blacksmith",
        "Novigrad",
      );
      merchantCollection.addMerchant(newMerchant);
      expect(merchantCollection.getMerchants()).toHaveLength(3); // No new merchant added
    });
  });

  describe("removeMerchant", () => {
    test("should remove a merchant by ID", () => {
      merchantCollection.removeMerchant("M-1");
      expect(merchantCollection.getMerchants()).toHaveLength(2);
      expect(merchantCollection.getMerchantById("M-1")).toBeUndefined();
    });

    test("should do nothing if the merchant ID does not exist", () => {
      merchantCollection.removeMerchant("M-999");
      expect(merchantCollection.getMerchants()).toHaveLength(3);
    });
  });

  describe("getMerchants", () => {
    test("should return all merchants in the collection", () => {
      const merchants = merchantCollection.getMerchants();
      expect(merchants).toHaveLength(3);
      expect(merchants[0].id).toBe("M-1");
      expect(merchants[1].id).toBe("M-2");
      expect(merchants[2].id).toBe("M-3");
    });
  });

  describe("modifyMerchant", () => {
    test("should modify a merchant's name", () => {
      merchantCollection.modifyMerchant("M-1", "name", "Hattori Hanzo");
      const modifiedMerchant = merchantCollection.getMerchantById("M-1");
      expect(modifiedMerchant?.name).toBe("Hattori Hanzo");
    });

    test("should modify a merchant's profession", () => {
      merchantCollection.modifyMerchant("M-2", "profession", "Druid");
      const modifiedMerchant = merchantCollection.getMerchantById("M-2");
      expect(modifiedMerchant?.profession).toBe("Druid");
    });

    test("should modify a merchant's location", () => {
      merchantCollection.modifyMerchant("M-3", "location", "Beauclair");
      const modifiedMerchant = merchantCollection.getMerchantById("M-3");
      expect(modifiedMerchant?.location).toBe("Beauclair");
    });

    test("should do nothing if the merchant ID does not exist", () => {
      merchantCollection.modifyMerchant("M-999", "name", "Unknown");
      expect(merchantCollection.getMerchants()).toHaveLength(3);
    });
  });

  describe("getMerchantById", () => {
    test("should get a merchant by ID", () => {
      const merchant = merchantCollection.getMerchantById("M-1");
      expect(merchant?.id).toBe("M-1");
      expect(merchant?.name).toBe("Hattori");
    });

    test("should return undefined if the merchant ID does not exist", () => {
      const merchant = merchantCollection.getMerchantById("M-999");
      expect(merchant).toBeUndefined();
    });
  });

  describe("getMerchantByName", () => {
    test("should get merchants by name", () => {
      const merchants = merchantCollection.getMerchantByName("Keira");
      expect(merchants).toHaveLength(1);
      expect(merchants[0].id).toBe("M-2");
    });

    test("should return an empty array if no merchants match the name", () => {
      const merchants = merchantCollection.getMerchantByName("Unknown");
      expect(merchants).toHaveLength(0);
    });
  });

  describe("getMerchantByLocation", () => {
    test("should get merchants by location", () => {
      const merchants = merchantCollection.getMerchantByLocation("Novigrad");
      expect(merchants).toHaveLength(2);
      expect(merchants[0].id).toBe("M-1");
      expect(merchants[1].id).toBe("M-3");
    });

    test("should return an empty array if no merchants match the location", () => {
      const merchants = merchantCollection.getMerchantByLocation("Unknown");
      expect(merchants).toHaveLength(0);
    });
  });

  describe("getMerchantByProfession", () => {
    test("should get merchants by profession", () => {
      const merchants = merchantCollection.getMerchantByProfession("Alchemist");
      expect(merchants).toHaveLength(1);
      expect(merchants[0].id).toBe("M-2");
    });

    test("should return an empty array if no merchants match the profession", () => {
      const merchants = merchantCollection.getMerchantByProfession("Druid");
      expect(merchants).toHaveLength(0);
    });
  });
});
