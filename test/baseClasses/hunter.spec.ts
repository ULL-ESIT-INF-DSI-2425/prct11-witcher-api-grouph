import { describe, expect, test, beforeEach } from "vitest";
import { Hunter, Race } from "../../src/hunter";

describe("Hunter class", () => {
  let hunter: Hunter;

  beforeEach(() => {
    hunter = new Hunter("H-1", "Geralt of Rivia", "Human", "Kaer Morhen");
  });

  describe("Constructor", () => {
    test("should create a Hunter instance with the correct properties", () => {
      expect(hunter.id).toBe("H-1");
      expect(hunter.name).toBe("Geralt of Rivia");
      expect(hunter.race).toBe("Human");
      expect(hunter.location).toBe("Kaer Morhen");
    });
  });

  describe("Getters", () => {
    test("should return the correct id", () => {
      expect(hunter.id).toBe("H-1");
    });

    test("should return the correct name", () => {
      expect(hunter.name).toBe("Geralt of Rivia");
    });

    test("should return the correct race", () => {
      expect(hunter.race).toBe("Human");
    });

    test("should return the correct location", () => {
      expect(hunter.location).toBe("Kaer Morhen");
    });
  });

  describe("Setters", () => {
    test("should update the id", () => {
      hunter.id = "H-2";
      expect(hunter.id).toBe("H-2");
    });

    test("should update the name", () => {
      hunter.name = "Ciri";
      expect(hunter.name).toBe("Ciri");
    });

    test("should update the race to a valid race", () => {
      hunter.race = "Elf";
      expect(hunter.race).toBe("Elf");
    });

    test("should throw an error when updating the race to an invalid race", () => {
      expect(() => {
        hunter.race = "Orc" as Race; // Force an invalid race
      }).toThrowError("Invalid race: Orc");
    });

    test("should update the location", () => {
      hunter.location = "Novigrad";
      expect(hunter.location).toBe("Novigrad");
    });
  });

  describe("Factory Method", () => {
    test("should create a Hunter instance with a prefixed ID", () => {
      const newHunter = Hunter.createHunter(10, "Lambert", "Dwarf", "Kaedwen");
      expect(newHunter.id).toBe("H-10");
      expect(newHunter.name).toBe("Lambert");
      expect(newHunter.race).toBe("Dwarf");
      expect(newHunter.location).toBe("Kaedwen");
    });
  });

  describe("toJSON Method", () => {
    test("should return the correct JSON representation", () => {
      const json = hunter.toJSON();
      expect(json).toEqual({
        id: "H-1",
        name: "Geralt of Rivia",
        race: "Human",
        location: "Kaer Morhen",
      });
    });
  });

  describe("Race Validation", () => {
    test("should allow all valid races", () => {
      const validRaces: Race[] = [
        "Human",
        "Elf",
        "Dwarf",
        "Halfling",
        "Warlock",
        "Lycanthropic",
        "Vran",
        "Dryad",
        "Spectral Cat",
        "Half-Elf",
      ];

      validRaces.forEach((race) => {
        hunter.race = race;
        expect(hunter.race).toBe(race);
      });
    });

    test("should throw an error for invalid races", () => {
      expect(() => {
        hunter.race = "Orc" as Race; // Force an invalid race
      }).toThrowError("Invalid race: Orc");
    });
  });
});
