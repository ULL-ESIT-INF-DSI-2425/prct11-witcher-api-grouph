/**
 * type that represents the possible professions of a merchant
 */
export type Profession =
  | "Blacksmith"
  | "Alchemist"
  | "General Merchant"
  | "Butcher"
  | "Druid"
  | "Smuggler";

/**
 * Class representing a merchant
 */
export class Merchant {
  /**
   * Constructor for the Merchant class
   * @param _id - The unique identifier for the merchant
   * @param _name - The name of the merchant
   * @param _profession - The profession of the merchant
   * @param _location - The location of the merchant
   */
  constructor(
    protected _id: string,
    protected _name: string,
    protected _profession: Profession,
    protected _location: string,
  ) {}

  /**
   * Getter for the id property
   * @returns The id of the merchant
   */
  get id(): string {
    return this._id;
  }

  /**
   * Getter for the name property
   * @returns The name of the merchant
   */
  get name(): string {
    return this._name;
  }

  /**
   * Getter for the profession property
   * @returns The profession of the merchant 
   */
  get profession(): Profession {
    return this._profession;
  }

  /**
   * Getter for the location property
   * @returns The location of the merchant
   */
  get location(): string {
    return this._location;
  }

  /**
   * Setter for the id property
   * @param newId - The new id for the merchant
   */
  set id(newId: string) {
    this._id = newId;
  }

  /**
   * Setter for the name property
   * @param newName - The new name for the merchant
   */
  set name(newName: string) {
    this._name = newName;
  }

  /**
   * Setter for the profession property
   * @param newProfession - The new profession for the merchant
   */
  set profession(newProfession: Profession) {
    this._profession = newProfession;
  }

  /**
   * Setter for the location property
   * @param newLocation - The new location for the merchant
   */
  set location(newLocation: string) {
    this._location = newLocation;
  }

  /**
   * Static method to create a merchant instance
   * @param id - The id of the merchant
   * @param name - The name of the merchant
   * @param profession - The profession of the merchant
   * @param location - The location of the merchant
   * @returns A new instance of the Merchant class
   */
  static createMerchant(
    id: number,
    name: string,
    profession: Profession,
    location: string,
  ): Merchant {
    const prefixedId = `M-${id}`;
    return new Merchant(prefixedId, name, profession, location);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      profession: this.profession,
      location: this.location,
    };
  }
}
