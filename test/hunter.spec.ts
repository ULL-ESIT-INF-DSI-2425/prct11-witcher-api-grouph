import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { before, beforeEach } from 'node:test';
import { Hunter } from '../src/models/hunter.js'

  beforeEach(async () => {
    await Hunter.deleteMany();
  });
  
  describe("POST /hunters", () => {
    test("Create a new Hunter", async () => {
      await request(app)
        .post("/hunters")
        .send({
          name: "Finn",
          race: "Human",
          location: "Ooo"
        }).expect(400); // 400
    });
  });
  
  describe("GET /hunters", () => {
    test("Get all", async () => {
      await request(app).get("/hunters").expect(200);
    });
    test("Get by location", async () => {
      await request(app).get("/hunters?location=Ooo").expect(200); // 404
    });
    test("Get by race", async () => {
      await request(app).get("/hunters?race=Human").expect(200);
    });
    test("Get by name", async () => {
      await request(app).get("/hunters?name=Finn").expect(200);
    });
    test("Get by multiple filters", async () => {
        await request(app).get("/hunters?name=Finn&race=Human").expect(200);
      });
  });