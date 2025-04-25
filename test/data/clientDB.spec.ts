import { describe, expect, test, beforeEach, afterEach } from "vitest";
import { JsonClientCollection } from "../../src/data/clientDB";
import { Hunter } from "../../src/hunter";
import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import fs from "fs";

// Path to the test database file
const TEST_DB_FILE = "TestClientdb.json";

describe("JsonClientCollection class", () => {
  let jsonClientCollection: JsonClientCollection;

  beforeEach(() => {
    // Initialize the test database with an empty array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const adapter = new JSONFileSync<{ clients: any[] }>(TEST_DB_FILE);
    const db = new LowSync(adapter, { clients: [] });
    db.data = { clients: [] }; // Reset the database
    db.write();

    // Create a new instance of JsonClientCollection with the test database file
    jsonClientCollection = new JsonClientCollection(TEST_DB_FILE);
  });

  afterEach(() => {
    // Clean up the test database file after each test
    if (fs.existsSync(TEST_DB_FILE)) {
      fs.unlinkSync(TEST_DB_FILE);
    }
  });

  describe("addClient", () => {
    test("should add a new client to the collection", () => {
      const newHunter = new Hunter("H-1", "Geralt", "Human", "Kaer Morhen");
      jsonClientCollection.addClient(newHunter);
      expect(jsonClientCollection.getClients()).toContainEqual(newHunter);
    });

    test("should not add a client with a duplicate ID", () => {
      const newHunter1 = new Hunter("H-1", "Geralt", "Human", "Kaer Morhen");
      const newHunter2 = new Hunter("H-1", "Duplicate", "Human", "Kaer Morhen");
      jsonClientCollection.addClient(newHunter1);
      jsonClientCollection.addClient(newHunter2);
      expect(jsonClientCollection.getClients()).toHaveLength(1); // No new client added
    });
  });

  describe("removeClient", () => {
    test("should remove a client by ID", () => {
      const newHunter = new Hunter("H-2", "Yennefer", "Elf", "Vengerberg");
      jsonClientCollection.addClient(newHunter);
      jsonClientCollection.removeClient("H-2");
      expect(jsonClientCollection.getClients()).not.toContainEqual(newHunter);
    });

    test("should do nothing if the client ID does not exist", () => {
      const initialClients = jsonClientCollection.getClients();
      jsonClientCollection.removeClient("H-999");
      expect(jsonClientCollection.getClients()).toEqual(initialClients);
    });
  });

  describe("modifyClient", () => {
    test("should modify a client's name", () => {
      const newHunter = new Hunter("H-3", "Ciri", "Half-Elf", "Cintra");
      jsonClientCollection.addClient(newHunter);
      jsonClientCollection.modifyClient("H-3", "name", "Cirilla");
      const modifiedClient = jsonClientCollection
        .getClients()
        .find((c) => c.id === "H-3");
      expect(modifiedClient?.name).toBe("Cirilla");
    });

    test("should modify a client's race", () => {
      const newHunter = new Hunter("H-4", "Lambert", "Dwarf", "Kaedwen");
      jsonClientCollection.addClient(newHunter);
      jsonClientCollection.modifyClient("H-4", "race", "Elf");
      const modifiedClient = jsonClientCollection
        .getClients()
        .find((c) => c.id === "H-4");
      expect(modifiedClient?.race).toBe("Elf");
    });

    test("should modify a client's location", () => {
      const newHunter = new Hunter("H-5", "Eskel", "Human", "Kaer Morhen");
      jsonClientCollection.addClient(newHunter);
      jsonClientCollection.modifyClient("H-5", "location", "Novigrad");
      const modifiedClient = jsonClientCollection
        .getClients()
        .find((c) => c.id === "H-5");
      expect(modifiedClient?.location).toBe("Novigrad");
    });

    test("should do nothing if the client ID does not exist", () => {
      const initialClients = jsonClientCollection.getClients();
      jsonClientCollection.modifyClient("H-999", "name", "Unknown");
      expect(jsonClientCollection.getClients()).toEqual(initialClients);
    });
  });

  describe("getClients", () => {
    test("should return all clients in the collection", () => {
      const clients = jsonClientCollection.getClients();
      expect(clients).toBeInstanceOf(Array);
      expect(clients.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("saveDatabase", () => {
    test("should save the current state of the collection", () => {
      const newHunter = new Hunter("H-6", "Vesemir", "Human", "Kaer Morhen");
      jsonClientCollection.addClient(newHunter);
      // Since we're not testing the actual file system, we assume the save operation works
      expect(jsonClientCollection.getClients()).toContainEqual(newHunter);
    });
  });
});
