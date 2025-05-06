import { describe, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { before, beforeEach } from 'node:test';
import { Weapon, Armor, Potion, Item, GenericMaterialValues } from '../src/models/item.js';

beforeEach(async () => {
  await Item.deleteMany();
  await Weapon.deleteMany();
  await Armor.deleteMany();
  await Potion.deleteMany();
});

describe("POST /goods", () => {
  test("should create a new armor", async () => {
    await request(app)
      .post("/goods")
      .send({
        name: "Test armor",
        description: "This is a test armor",
        material: "Mithril",
        weight: 7,
        price: 100,
        quantity: 1,
  })
  .expect(201);
  });
  test("should create a new weapon", async () => {
    await request(app)
      .post("/goods")
      .send({
        name: "Test sword",
        description: "This is a test sword",
        material: "Elven Steel",
        weight: 5,
        price: 50,
        quantity: 1,
      })
      .expect(201);
  });
  test("should create a new potion", async () => {
    await request(app)
      .post("/goods")
      .send({
        name: "Test potion",
        description: "This is a test potion",
        material: "Griffin Marrow",
        weight: 1,
        price: 10,
        quantity: 1,
        effect: "Test effect",
      })
      .expect(201);
  });
});