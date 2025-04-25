import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import { Hunter, Race } from "../hunter.js";
import { ClientCollection } from "../collections/clientCollection.js";

/**
 * Schema for the client database
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientDataBaseSchema = { clients: any[] };

/**
 * Class to manage a collection of clients
 */
export class JsonClientCollection extends ClientCollection {
  private database: LowSync<ClientDataBaseSchema>;

  /**
   * Constructor for the JsonClientCollection class
   * @param dbFilePath Path to the database file (optional)
   */
  constructor(dbFilePath: string = "Clientdb.json") {
    super((id, name, race, location) => new Hunter(id, name, race, location));

    const adapter = new JSONFileSync<ClientDataBaseSchema>(dbFilePath);
    this.database = new LowSync(adapter, { clients: [] });
    this.database.read();
    if (!this.database.data || !Array.isArray(this.database.data.clients)) {
      console.log("📂 Database was empty. Initializing...");
      this.database.data = { clients: [] };
      this.database.write();
    }
    this.clients = this.database.data.clients
      .filter((h) => Object.keys(h).length > 0)
      .map((h) => {
        const id = h.id ?? h._id;
        const name = h.name ?? h._name;
        const race = h.race ?? h._race;
        const location = h.location ?? h._location;
        return this.createHunter(id, name, race, location);
      });

    console.log("📂 Database loaded with", this.clients.length, "clients.");
  }

  /**
   * Saves the current state of the database.
   */
  private saveDatabase(): void {
    this.database.read();
    this.database.data.clients = this.clients.map((client) =>
      typeof client.toJSON === "function" ? client.toJSON() : client,
    );
    this.database.write();
  }

  /**
   * Adds a new client to the collection.
   * @param newHunter The new client (Hunter) to add.
   */
  addClient(newHunter: Hunter): void {
    this.database.read();
    super.addClient(newHunter);
    this.saveDatabase();
  }

  /**
   * Removes a client from the collection.
   * @param removeId The ID of the client to remove.
   */
  removeClient(removeId: string): void {
    this.database.read();
    super.removeClient(removeId);
    this.saveDatabase();
  }

  /**
   * Modifies a client's information.
   * @param modifyId The ID of the client to modify.
   * @param parameter The field to modify.
   * @param newValue The new value for the field.
   */
  modifyClient(
    modifyId: string,
    parameter: keyof Hunter,
    newValue: string | Race,
  ): void {
    this.database.read();
    super.modifyClient(modifyId, parameter, newValue);
    this.saveDatabase();
  }

  /**
   * getter for the clients in the collection
   * @returns A list of all clients in the collection.
   */
  getClients(): Hunter[] {
    return this.clients;
  }
}
