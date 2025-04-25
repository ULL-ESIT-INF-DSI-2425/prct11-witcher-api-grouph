import { Hunter, Race } from "../hunter.js";

/**
 * Class to manage a collection of clients
 */
export class ClientCollection {
  protected clients: Hunter[] = [];

  /**
   * Constructor for the ClientCollection class
   * @param createHunter - Function to create a new hunter
   */
  constructor(
    protected createHunter: (
      id: string,
      name: string,
      race: Race,
      location: string,
    ) => Hunter,
  ) {}

  /**
   * Method to add a new client to the collection
   * @param newHunter The new hunter to add
   * @returns void
   */
  addClient(newHunter: Hunter): void {
    if (this.clients.some((h) => h.id === newHunter.id)) {
      console.log(
        `/// WARNING: Hunter with ID ${newHunter.id} already exists ///`,
      );
      return;
    }
    this.clients.push(newHunter);
  }

  /**
   * Method to remove a client from the collection
   * @param removeId The id of the client to remove
   * @returns void
   */
  removeClient(removeId: string): void {
    this.clients = this.clients.filter((h) => h.id !== removeId);
  }

  /**
   * Method to get all clients
   * @returns All clients in the collection
   */
  getClients(): Hunter[] {
    return this.clients;
  }

  /**
   * Method to modify a client's information
   * @param modifyId The id of the client to modify
   * @param parameter The parameter to modify
   * @param newValue The new value for the parameter
   * @returns void
   */
  modifyClient(
    modifyId: string,
    parameter: keyof Hunter,
    newValue: string | Race,
  ): void {
    const hunter = this.clients.find((h) => h.id === modifyId);
    if (hunter) {
      hunter[parameter] = newValue as never;
    } else {
      console.log(`/// WARNING: Hunter with ID ${modifyId} not found ///`);
    }
  }

  /**
   * Method to get a client by a specific parameter
   * @param parameter The parameter to search by
   * @param value The value to search for
   * @returns The client(s) that match the search
   */
  getClientBy(parameter: keyof Hunter, value: string | Race): Hunter[] {
    const result = this.clients.filter((h) => h[parameter] === value);
    this.printFormatted(`Clients filtered by ${parameter} = ${value}`, result);
    return result;
  }

  /**
   * Method to get a client by their id
   * @param id The id of the client to search for
   * @returns The client that matches the id
   */
  getClientById(id: string): Hunter | undefined {
    const hunter = this.clients.find((h) => h.id === id);
    if (hunter) {
      this.printFormatted(`Client with ID "${id}"`, [hunter]);
    } else {
      console.log(`No client found with ID "${id}"`);
    }
    return hunter;
  }

  /**
   * Method to get a client by their name
   * @param name The name of the client to search for
   * @returns The client(s) that match the name
   */
  getClientByName(name: string): Hunter[] {
    const result = this.clients.filter((h) => h.name === name);
    this.printFormatted(`Clients with name "${name}"`, result);
    return result;
  }

  /**
   * Method to get a client by race
   * @param race The race of the client to search for
   * @returns The client(s) that match the race
   */
  getClientByRace(race: Race): Hunter[] {
    const result = this.clients.filter((h) => h.race === race);
    this.printFormatted(`Clients with race "${race}"`, result);
    return result;
  }

  /**
   * Method to get a client by location
   * @param location The location of the client to search for
   * @returns The client(s) that match the location
   */
  getClientByLocation(location: string): Hunter[] {
    const result = this.clients.filter((h) => h.location === location);
    this.printFormatted(`Clients in location "${location}"`, result);
    return result;
  }

  /**
   * Método privado para imprimir de forma formateada una lista de hunters
   * @param title Título de la operación
   * @param clients Arreglo de hunters a imprimir
   */
  private printFormatted(title: string, clients: Hunter[]): void {
    console.log(`\n=== ${title} ===`);
    if (clients.length === 0) {
      console.log("No clients found.");
    } else {
      console.table(
        clients.map((h) => ({
          ID: h.id,
          Name: h.name,
          Race: h.race,
          Location: h.location,
        })),
      );
    }
  }
}
