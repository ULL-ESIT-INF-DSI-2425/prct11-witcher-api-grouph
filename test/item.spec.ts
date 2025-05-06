import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { before, beforeEach } from 'node:test';
import { Weapon, Armor, Potion, Item, WeaponMaterial, ArmorMaterial, PotionMaterial } from '../src/models/item.js';
import { ScriptElementKindModifier } from 'typescript';

const firstWeapon = {
  name: "Sword of Destiny",
  description: "A legendary sword forged in the fires of Mount Doom.",
  material: "Steel",
  weight: 5,
  price: 100,
  quantity: 1,
}

const firstArmor = {
  name: "Dragon Scale Armor",
  description: "An armor made from the scales of a dragon.",
  material: "Dragon Scale",
  weight: 10,
  price: 200,
  quantity: 1,
}
const firstPotion = {
  name: "Healing Potion",
  description: "A potion that heals wounds.",
  material: "Mandrake Root",
  weight: 1,
  price: 50,
  quantity: 1,
  effect: "Heal",
}

beforeEach(async () => {
  await Item.deleteMany();
  await Weapon.deleteMany();
  await Armor.deleteMany();
  await Potion.deleteMany();
  await new Weapon(firstWeapon).save();
  await new Armor(firstArmor).save();
  await new Potion(firstPotion).save();
});

describe("POST /goods", () => {
  test("should create a new armor", async () => {
    const response = await request(app)
      .post("/goods")
      .send({
        name: "Test armor",
        description: "This is a test armor",
        material: "Leather",
        weight: 10,
        price: 100,
        quantity: 1,
      })
      .expect(201);
    expect(response.body).to.include({
      name: "Test armor",
      description: "This is a test armor",
      material: "Leather",
      weight: 10,
      price: 100,
      quantity: 1,
      kind: "Armor"
    });
  });
});
