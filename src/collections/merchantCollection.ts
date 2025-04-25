import { Merchant, Profession } from "../merchant.js";

/**
 * Class to manage a collection of merchants
 */
export class MerchantCollection {
  protected merchants: Merchant[] = [];

  /**
   * Constructor for the MerchantCollection class
   * @param createMerchant - Function to create a new merchant
   */
  constructor(
    protected createMerchant: (
      id: string,
      name: string,
      profession: Profession,
      location: string,
    ) => Merchant,
  ) {}

  /**
   * Method to add a new merchant to the collection
   * @param newMerchant The new merchant to add
   */
  addMerchant(newMerchant: Merchant): void {
    if (this.merchants.some((m) => m.id === newMerchant.id)) {
      console.log(
        `/// WARNING: Merchant with ID ${newMerchant.id} already exists ///`,
      );
      return;
    }
    this.merchants.push(newMerchant);
  }

  /**
   * Method to remove a merchant from the collection
   * @param removeId The id of the merchant to remove
   */
  removeMerchant(removeId: string): void {
    this.merchants = this.merchants.filter((m) => m.id !== removeId);
  }

  /**
   * Method to get all merchants
   * @returns All merchants in the collection
   */
  getMerchants(): Merchant[] {
    return this.merchants;
  }

  /**
   * Method to modify a merchant's information
   * @param modifyId The id of the merchant to modify
   * @param parameter The parameter to modify
   * @param newValue The new value for the parameter
   */
  modifyMerchant(
    modifyId: string,
    parameter: keyof Merchant,
    newValue: string | Profession,
  ): void {
    const merchant = this.merchants.find((m) => m.id === modifyId);
    if (merchant) {
      merchant[parameter] = newValue as never;
    } else {
      console.log(`/// WARNING: Merchant with ID ${modifyId} not found ///`);
    }
  }

  /**
   * Method to get a merchant by their id
   * @param id ID of the merchant
   * @returns The merchant with the given ID, or undefined if not found
   */
  getMerchantById(id: string): Merchant | undefined {
    return this.getMerchantBy("id", id)[0];
  }

  /**
   * Method to get merchants by their name
   * @param name Name of the merchant
   * @returns The merchants with the given name
   */
  getMerchantByName(name: string): Merchant[] {
    return this.getMerchantBy("name", name);
  }

  /**
   * Method to get merchants by their location
   * @param location Location of the merchant
   * @returns The merchants that match the location
   */
  getMerchantByLocation(location: string): Merchant[] {
    return this.getMerchantBy("location", location);
  }

  /**
   * Method to get merchants by their profession
   * @param profession Profession of the merchant
   * @returns The merchants that match the profession
   */
  getMerchantByProfession(profession: Profession): Merchant[] {
    return this.getMerchantBy("profession", profession);
  }

  /**
   * Private method to get merchants by a specific parameter
   * @param parameter The parameter to filter by
   * @param value The value to match
   * @returns Array of matching merchants
   */
  private getMerchantBy(
    parameter: keyof Merchant,
    value: string | Profession,
  ): Merchant[] {
    const result = this.merchants.filter((m) => m[parameter] === value);
    this.printFormatted(
      `Merchants filtered by ${parameter} = ${value}`,
      result,
    );
    return result;
  }

  /**
   * Private method to print an array of merchants in a formatted table.
   * @param title Title of the printed output.
   * @param merchants Array of merchants to print.
   */
  private printFormatted(title: string, merchants: Merchant[]): void {
    console.log(`\n=== ${title} ===`);
    if (merchants.length === 0) {
      console.log("No merchants found.");
    } else {
      console.table(
        merchants.map((m) => ({
          ID: m.id,
          Name: m.name,
          Profession: m.profession,
          Location: m.location,
        })),
      );
    }
  }
}
