import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { before, beforeEach } from 'node:test';
import { Merchant } from '../src/models/merchant.js'

beforeEach(async () => {
    await Merchant.deleteMany();
  });
  
  describe("POST /merchants", () => {
    test("Create a new Merchant", async () => {
      await request(app)
        .post("/merchants")
        .send({
          name: "Billy",
          profession: "Butcher",
        })
        .expect(201);
    });
  });
  
  describe("GET /goods", () => {
    test("Get all", async () => {
      await request(app).get("/merchants").expect(200);
    });
    test("Get by location", async () => {
      await request(app).get("/merchants?location=Novigrado").expect(200);
    });
    test("Get by profession", async () => {
      await request(app).get("/merchants?profession=Butcher").expect(200);
    });
    test("Get by name", async () => {
      await request(app).get("/merchants?name=Billy").expect(200);
    });
    test("Get by multiple filters", async () => {
        await request(app).get("/merchants?name=Billy&profession=Butcher").expect(200);
      });
  });
  
//   describe("PATCH /goods", () => {
//     test("Should change the item", async () => {
//       await request(app)
//       .patch("/goods/681a4843dc7ad65bd5462cd2")
//       .send({
//         name: "Camisa",
//       }).expect(200)
//     })
//   })
  
//   describe("DELETE /goods", () => {
//     test("Should delete the item", async () => {
//       await request(app).delete("/goods/681a4843dc7ad65bd5462cd2").expect(200)
//     })
//   })
  
  
  
  