import { describe, expect, test, beforeEach } from "vitest";
import { Armor, Weapon, Potion } from "../../src/item";

describe("BaseItem class (indirectly tested via subclasses)", () => {
  let armor: Armor;
  let weapon: Weapon;
  let potion: Potion;

  beforeEach(() => {
    armor = new Armor(
      "A-1",
      "Dragon Scale Armor",
      "Strong and durable",
      "Dragon Scales",
      15,
      500,
    );
    weapon = new Weapon(
      "W-1",
      "Silver Sword",
      "Effective against monsters",
      "Silver",
      8,
      300,
    );
    potion = new Potion(
      "P-1",
      "Swallow",
      "Restores vitality",
      "Celandine Flower",
      0.5,
      50,
      "Vitality Regeneration",
    );
  });

  describe("Getters", () => {
    test("should return the correct id for Armor", () => {
      expect(armor.id).toBe("A-1");
    });

    test("should return the correct id for Weapon", () => {
      expect(weapon.id).toBe("W-1");
    });

    test("should return the correct id for Potion", () => {
      expect(potion.id).toBe("P-1");
    });

    test("should return the correct name for Armor", () => {
      expect(armor.name).toBe("Dragon Scale Armor");
    });

    test("should return the correct name for Weapon", () => {
      expect(weapon.name).toBe("Silver Sword");
    });

    test("should return the correct name for Potion", () => {
      expect(potion.name).toBe("Swallow");
    });
  });

  describe("Setters", () => {
    test("should update the id for Armor", () => {
      armor.id = "A-2";
      expect(armor.id).toBe("A-2");
    });

    test("should update the id for Weapon", () => {
      weapon.id = "W-2";
      expect(weapon.id).toBe("W-2");
    });

    test("should update the id for Potion", () => {
      potion.id = "P-2";
      expect(potion.id).toBe("P-2");
    });

    test("should update the name for Armor", () => {
      armor.name = "Leather Armor";
      expect(armor.name).toBe("Leather Armor");
    });

    test("should update the name for Weapon", () => {
      weapon.name = "Steel Dagger";
      expect(weapon.name).toBe("Steel Dagger");
    });

    test("should update the name for Potion", () => {
      potion.name = "Cat";
      expect(potion.name).toBe("Cat");
    });
  });

  describe("toJSON Method", () => {
    test("should return the correct JSON representation for Armor", () => {
      const json = armor.toJSON();
      expect(json).toEqual({
        id: "A-1",
        name: "Dragon Scale Armor",
        description: "Strong and durable",
        material: "Dragon Scales",
        weight: 15,
        price: 500,
      });
    });

    test("should return the correct JSON representation for Weapon", () => {
      const json = weapon.toJSON();
      expect(json).toEqual({
        id: "W-1",
        name: "Silver Sword",
        description: "Effective against monsters",
        material: "Silver",
        weight: 8,
        price: 300,
      });
    });

    test("should return the correct JSON representation for Potion", () => {
      const json = potion.toJSON();
      expect(json).toEqual({
        id: "P-1",
        name: "Swallow",
        description: "Restores vitality",
        material: "Celandine Flower",
        weight: 0.5,
        price: 50,
        effect: "Vitality Regeneration",
      });
    });
  });
});

describe("Armor class", () => {
  let armor: Armor;

  beforeEach(() => {
    armor = new Armor(
      "A-1",
      "Dragon Scale Armor",
      "Strong and durable",
      "Dragon Scales",
      15,
      500,
    );
  });

  describe("Constructor", () => {
    test("should create an Armor instance with the correct properties", () => {
      expect(armor.id).toBe("A-1");
      expect(armor.name).toBe("Dragon Scale Armor");
      expect(armor.description).toBe("Strong and durable");
      expect(armor.material).toBe("Dragon Scales");
      expect(armor.weight).toBe(15);
      expect(armor.price).toBe(500);
    });
  });

  describe("Factory Method", () => {
    test("should create an Armor instance with a prefixed ID", () => {
      const newArmor = Armor.createArmor(
        10,
        "Leather Armor",
        "Light and flexible",
        "Leather",
        5,
        100,
      );
      expect(newArmor.id).toBe("A-10");
      expect(newArmor.name).toBe("Leather Armor");
      expect(newArmor.description).toBe("Light and flexible");
      expect(newArmor.material).toBe("Leather");
      expect(newArmor.weight).toBe(5);
      expect(newArmor.price).toBe(100);
    });
  });
});

describe("Weapon class", () => {
  let weapon: Weapon;

  beforeEach(() => {
    weapon = new Weapon(
      "W-1",
      "Silver Sword",
      "Effective against monsters",
      "Silver",
      8,
      300,
    );
  });

  describe("Constructor", () => {
    test("should create a Weapon instance with the correct properties", () => {
      expect(weapon.id).toBe("W-1");
      expect(weapon.name).toBe("Silver Sword");
      expect(weapon.description).toBe("Effective against monsters");
      expect(weapon.material).toBe("Silver");
      expect(weapon.weight).toBe(8);
      expect(weapon.price).toBe(300);
    });
  });

  describe("Factory Method", () => {
    test("should create a Weapon instance with a prefixed ID", () => {
      const newWeapon = Weapon.createWeapon(
        10,
        "Steel Dagger",
        "Small but deadly",
        "Steel",
        3,
        80,
      );
      expect(newWeapon.id).toBe("W-10");
      expect(newWeapon.name).toBe("Steel Dagger");
      expect(newWeapon.description).toBe("Small but deadly");
      expect(newWeapon.material).toBe("Steel");
      expect(newWeapon.weight).toBe(3);
      expect(newWeapon.price).toBe(80);
    });
  });
});

describe("Potion class", () => {
  let potion: Potion;

  beforeEach(() => {
    potion = new Potion(
      "P-1",
      "Swallow",
      "Restores vitality",
      "Celandine Flower",
      0.5,
      50,
      "Vitality Regeneration",
    );
  });

  describe("Constructor", () => {
    test("should create a Potion instance with the correct properties", () => {
      expect(potion.id).toBe("P-1");
      expect(potion.name).toBe("Swallow");
      expect(potion.description).toBe("Restores vitality");
      expect(potion.material).toBe("Celandine Flower");
      expect(potion.weight).toBe(0.5);
      expect(potion.price).toBe(50);
      expect(potion.effect).toBe("Vitality Regeneration");
    });
  });

  describe("Factory Method", () => {
    test("should create a Potion instance with a prefixed ID", () => {
      const newPotion = Potion.createPotion(
        10,
        "Cat",
        "Enhances night vision",
        "Mandrake",
        0.3,
        40,
        "Night Vision",
      );
      expect(newPotion.id).toBe("P-10");
      expect(newPotion.name).toBe("Cat");
      expect(newPotion.description).toBe("Enhances night vision");
      expect(newPotion.material).toBe("Mandrake");
      expect(newPotion.weight).toBe(0.3);
      expect(newPotion.price).toBe(40);
      expect(newPotion.effect).toBe("Night Vision");
    });
  });
});
