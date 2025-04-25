import { describe, expect, test, beforeEach } from "vitest";
import { Merchant, Profession } from "../../src/merchant";

describe("Merchant class", () => {
  let merchant: Merchant;

  beforeEach(() => {
    merchant = new Merchant("M-1", "Hattori", "Blacksmith", "Novigrad");
  });

  describe("Constructor", () => {
    test("should create a Merchant instance with the correct properties", () => {
      expect(merchant.id).toBe("M-1");
      expect(merchant.name).toBe("Hattori");
      expect(merchant.profession).toBe("Blacksmith");
      expect(merchant.location).toBe("Novigrad");
    });
  });

  describe("Getters", () => {
    test("should return the correct id", () => {
      expect(merchant.id).toBe("M-1");
    });

    test("should return the correct name", () => {
      expect(merchant.name).toBe("Hattori");
    });

    test("should return the correct profession", () => {
      expect(merchant.profession).toBe("Blacksmith");
    });

    test("should return the correct location", () => {
      expect(merchant.location).toBe("Novigrad");
    });
  });

  describe("Setters", () => {
    test("should update the id", () => {
      merchant.id = "M-2";
      expect(merchant.id).toBe("M-2");
    });

    test("should update the name", () => {
      merchant.name = "Keira";
      expect(merchant.name).toBe("Keira");
    });

    test("should update the profession to a valid profession", () => {
      merchant.profession = "Alchemist";
      expect(merchant.profession).toBe("Alchemist");
    });

    test("should update the location", () => {
      merchant.location = "Velen";
      expect(merchant.location).toBe("Velen");
    });
  });

  describe("Factory Method", () => {
    test("should create a Merchant instance with a prefixed ID", () => {
      const newMerchant = Merchant.createMerchant(
        10,
        "Otto",
        "Butcher",
        "Novigrad",
      );
      expect(newMerchant.id).toBe("M-10");
      expect(newMerchant.name).toBe("Otto");
      expect(newMerchant.profession).toBe("Butcher");
      expect(newMerchant.location).toBe("Novigrad");
    });
  });

  describe("toJSON Method", () => {
    test("should return the correct JSON representation", () => {
      const json = merchant.toJSON();
      expect(json).toEqual({
        id: "M-1",
        name: "Hattori",
        profession: "Blacksmith",
        location: "Novigrad",
      });
    });
  });

  describe("Profession Validation", () => {
    test("should allow all valid professions", () => {
      const validProfessions: Profession[] = [
        "Blacksmith",
        "Alchemist",
        "General Merchant",
        "Butcher",
        "Druid",
        "Smuggler",
      ];

      validProfessions.forEach((profession) => {
        merchant.profession = profession;
        expect(merchant.profession).toBe(profession);
      });
    });
  });
});
