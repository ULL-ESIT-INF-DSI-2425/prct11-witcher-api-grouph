/**
 * type that represents the possible races of a hunter
 */
export type Race =
  | "Human"
  | "Elf"
  | "Dwarf"
  | "Halfling"
  | "Warlock"
  | "Lycanthropic"
  | "Vran"
  | "Dryad"
  | "Spectral Cat"
  | "Half-Elf";

/**
 * Class representing a hunter
 */
export class Hunter {
  /**
   * Constructor for the Hunter class
   * @param _id - The unique identifier for the hunter
   * @param _name - The name of the hunter
   * @param _race - The race of the hunter
   * @param _location - The location of the hunter
   */
  constructor(
    protected _id: string,
    protected _name: string,
    protected _race: Race,
    protected _location: string,
  ) {}

  /**
   * Getter for the id property
   * @returns The id of the hunter
   */
  get id(): string {
    return this._id;
  }

  /**
   * Getter for the name property
   * @returns The name of the hunter
   */
  get name(): string {
    return this._name;
  }

  /**
   * Getter for the race property
   * @returns The race of the hunter
   */
  get race(): Race {
    return this._race;
  }

  /**
   * Getter for the location property
   * @returns The location of the hunter
   */
  get location(): string {
    return this._location;
  }

  /**
   * Setter for the id property
   * @param newId - The new id for the hunter
   */
  set id(newId: string) {
    this._id = newId;
  }

  /**
   * Setter for the name property
   * @param newName - The new name for the hunter
   */
  set name(newName: string) {
    this._name = newName;
  }

  /**
   * Setter for the race property
   * @param newRace - The new race for the hunter
   */
  set race(newRace: Race) {
    if (
      ![
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
      ].includes(newRace)
    ) {
      throw new Error(`Invalid race: ${newRace}`);
    }
    this._race = newRace;
  }

  /**
   * Setter for the location property
   * @param newLocation - The new location for the hunter
   */
  set location(newLocation: string) {
    this._location = newLocation;
  }

  /**
   * Factory method to create a new hunter
   * @param id - The id of the hunter
   * @param name - The name of the hunter
   * @param race - The race of the hunter
   * @param location - The location of the hunter
   * @returns A new instance of the Hunter class
   */
  static createHunter(
    id: number,
    name: string,
    race: Race,
    location: string,
  ): Hunter {
    const prefixedId = `H-${id}`;
    return new Hunter(prefixedId, name, race, location);
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      race: this._race,
      location: this._location,
    };
  }
}
