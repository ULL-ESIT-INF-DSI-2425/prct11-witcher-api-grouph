import { describe, expect, test, beforeEach, vi } from "vitest";
import { ClientCollection } from "../../src/collections/clientCollection";
import { Hunter, Race } from "../../src/hunter";

describe("ClientCollection class", () => {
  let clientCollection: ClientCollection;
  let createHunter: (
    id: string,
    name: string,
    race: Race,
    location: string,
  ) => Hunter;

  beforeEach(() => {
    // Mock the createHunter function
    createHunter = vi.fn(
      (id: string, name: string, race: Race, location: string) => {
        return new Hunter(id, name, race, location);
      },
    );

    clientCollection = new ClientCollection(createHunter);

    // Add some initial clients for testing
    clientCollection.addClient(
      new Hunter("H-1", "Geralt", "Human", "Kaer Morhen"),
    );
    clientCollection.addClient(
      new Hunter("H-2", "Yennefer", "Elf", "Vengerberg"),
    );
    clientCollection.addClient(new Hunter("H-3", "Ciri", "Half-Elf", "Cintra"));
  });

  describe("addClient", () => {
    test("should add a new client to the collection", () => {
      const newHunter = new Hunter("H-4", "Lambert", "Dwarf", "Kaedwen");
      clientCollection.addClient(newHunter);
      expect(clientCollection.getClients()).toHaveLength(4);
      expect(clientCollection.getClientById("H-4")).toEqual(newHunter);
    });

    test("should not add a client with a duplicate ID", () => {
      const newHunter = new Hunter("H-1", "Duplicate", "Human", "Kaer Morhen");
      clientCollection.addClient(newHunter);
      expect(clientCollection.getClients()).toHaveLength(3); // No new client added
    });
  });

  describe("removeClient", () => {
    test("should remove a client by ID", () => {
      clientCollection.removeClient("H-1");
      expect(clientCollection.getClients()).toHaveLength(2);
      expect(clientCollection.getClientById("H-1")).toBeUndefined();
    });

    test("should do nothing if the client ID does not exist", () => {
      clientCollection.removeClient("H-999");
      expect(clientCollection.getClients()).toHaveLength(3);
    });
  });

  describe("getClients", () => {
    test("should return all clients in the collection", () => {
      const clients = clientCollection.getClients();
      expect(clients).toHaveLength(3);
      expect(clients[0].id).toBe("H-1");
      expect(clients[1].id).toBe("H-2");
      expect(clients[2].id).toBe("H-3");
    });
  });

  describe("modifyClient", () => {
    test("should modify a client's name", () => {
      clientCollection.modifyClient("H-1", "name", "Geralt of Rivia");
      const modifiedClient = clientCollection.getClientById("H-1");
      expect(modifiedClient?.name).toBe("Geralt of Rivia");
    });

    test("should modify a client's race", () => {
      clientCollection.modifyClient("H-2", "race", "Half-Elf");
      const modifiedClient = clientCollection.getClientById("H-2");
      expect(modifiedClient?.race).toBe("Half-Elf");
    });

    test("should modify a client's location", () => {
      clientCollection.modifyClient("H-3", "location", "Novigrad");
      const modifiedClient = clientCollection.getClientById("H-3");
      expect(modifiedClient?.location).toBe("Novigrad");
    });

    test("should do nothing if the client ID does not exist", () => {
      clientCollection.modifyClient("H-999", "name", "Unknown");
      expect(clientCollection.getClients()).toHaveLength(3);
    });
  });

  describe("getClientBy", () => {
    test("should get clients by name", () => {
      const clients = clientCollection.getClientBy("name", "Geralt");
      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe("H-1");
    });

    test("should get clients by race", () => {
      const clients = clientCollection.getClientBy("race", "Elf");
      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe("H-2");
    });

    test("should get clients by location", () => {
      const clients = clientCollection.getClientBy("location", "Cintra");
      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe("H-3");
    });

    test("should return an empty array if no clients match the criteria", () => {
      const clients = clientCollection.getClientBy("name", "Unknown");
      expect(clients).toHaveLength(0);
    });
  });

  describe("getClientById", () => {
    test("should get a client by ID", () => {
      const client = clientCollection.getClientById("H-1");
      expect(client?.id).toBe("H-1");
      expect(client?.name).toBe("Geralt");
    });

    test("should return undefined if the client ID does not exist", () => {
      const client = clientCollection.getClientById("H-999");
      expect(client).toBeUndefined();
    });
  });

  describe("getClientByName", () => {
    test("should get clients by name", () => {
      const clients = clientCollection.getClientByName("Geralt");
      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe("H-1");
    });

    test("should return an empty array if no clients match the name", () => {
      const clients = clientCollection.getClientByName("Unknown");
      expect(clients).toHaveLength(0);
    });
  });

  describe("getClientByRace", () => {
    test("should get clients by race", () => {
      const clients = clientCollection.getClientByRace("Elf");
      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe("H-2");
    });

    test("should return an empty array if no clients match the race", () => {
      const clients = clientCollection.getClientByRace("Dwarf");
      expect(clients).toHaveLength(0);
    });
  });

  describe("getClientByLocation", () => {
    test("should get clients by location", () => {
      const clients = clientCollection.getClientByLocation("Cintra");
      expect(clients).toHaveLength(1);
      expect(clients[0].id).toBe("H-3");
    });

    test("should return an empty array if no clients match the location", () => {
      const clients = clientCollection.getClientByLocation("Unknown");
      expect(clients).toHaveLength(0);
    });
  });
});
