/**
 * type that represents the possible materials for a weapon
 */
export type WeaponMaterial =
  | "Steel"
  | "Elven Steel"
  | "Meteoric Steel"
  | "Silver"
  | "Reinforced Silver"
  | "Ebony Wood"
  | "Monster Bone"
  | "Volcanic Glass"
  | "Mithril"
  | "Adamantite";

/**
 * type that represents the possible materials for an armor
 */
export type ArmorMaterial =
  | "Leather"
  | "Hardened Leather"
  | "Steel Mesh"
  | "Silver Mesh"
  | "Dragon Scales"
  | "Adamantite Plates"
  | "Mithril"
  | "Enchanted Fabric"
  | "Monster Bone"
  | "Insectoid Chitin";

/**
 * type that represents the possible materials for a potion
 */
export type PotionMaterial =
  | "Celandine Flower"
  | "Mandrake"
  | "Vervain"
  | "Bryonia Root"
  | "Crushed Kikimora Skull"
  | "Nekker Gland"
  | "Wraith Essence"
  | "Griffin Marrow"
  | "Endrega Mucus"
  | "Ghoul Blood";

/**
 * type that represents the possible materials for an item
 */
export type GenericMaterial = ArmorMaterial | WeaponMaterial | PotionMaterial;

/**
 * type that represents the possible effects for a potion
 */
export type Effect =
  | "Vitality Regeneration"
  | "Night Vision"
  | "Poison Resistance"
  | "Strength Boost"
  | "Speed Boost"
  | "Increased Sign Damage"
  | "Toxicity Reduction"
  | "Invisible Creature Detection"
  | "Temporary Enemy Paralysis"
  | "Life Absorption"
  | "Unknown Effect"
  | "None";

/**
 * Abstract class representing a base item
 */
export abstract class BaseItem {
  /**
   * Constructor for the BaseItem class
   * @param _id id of the item
   * @param _name name of the item
   * @param _description description of the item
   * @param _material material of the item
   * @param _weight weight of the item
   * @param _price price of the item
   */
  constructor(
    protected _id: string,
    protected _name: string,
    protected _description: string,
    protected _material: GenericMaterial,
    protected _weight: number,
    protected _price: number,
  ) {}

  /**
   * Getter for the id property
   * @returns The id of the item
   */
  get id(): string {
    return this._id;
  }

  /**
   * Getter for the name property
   * @returns The name of the item
   */
  get name(): string {
    return this._name;
  }

  /**
   * Getter for the description property
   * @returns The description of the item
   */
  get description(): string {
    return this._description;
  }

  /**
   * Getter for the material property
   * @returns The material of the item
   */
  get material(): GenericMaterial {
    return this._material;
  }

  /**
   * Getter for the weight property
   * @returns The weight of the item
   */
  get weight(): number {
    return this._weight;
  }

  /**
   * Getter for the price property
   * @returns The price of the item
   */
  get price(): number {
    return this._price;
  }

  /**
   * Setter for the id property
   * @param newId - The new id for the item
   */
  set id(newId: string) {
    this._id = newId;
  }

  /**
   * Setter for the name property
   * @param newName - The new name for the item
   */
  set name(newName: string) {
    this._name = newName;
  }

  /**
   * Setter for the description property
   * @param newDescription - The new description for the item
   */
  set description(newDescription: string) {
    this._description = newDescription;
  }

  /**
   * Setter for the material property
   * @param newMaterial - The new material for
   */
  set material(newMaterial: GenericMaterial) {
    this._material = newMaterial;
  }

  /**
   * Setter for the weight property
   * @param newWeight - The new weight for the item
   */
  set weight(newWeight: number) {
    this._weight = newWeight;
  }

  /**
   * Setter for the price property
   * @param newPrice - The new price for the item
   */
  set price(newPrice: number) {
    this._price = newPrice;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      material: this.material,
      weight: this.weight,
      price: this.price,
    };
  }
}

/**
 * Class representing an armor item
 */
export class Armor extends BaseItem {
  /**
   * Constructor for the Armor class
   * @param id id of the armor
   * @param name name of the armor
   * @param description description of the armor
   * @param _material material of the armor
   * @param weight weight of the armor
   * @param price price of the armor
   */
  constructor(
    id: string,
    name: string,
    description: string,
    protected _material: ArmorMaterial,
    weight: number,
    price: number,
  ) {
    super(id, name, description, _material, weight, price);
  }

  /**
   * Getter for the material property
   * @returns The material of the armor
   */
  get material(): ArmorMaterial {
    return this._material;
  }

  /**
   * Setter for the material property
   * @param newMaterial - The new material for the armor
   */
  set material(newMaterial: ArmorMaterial) {
    this._material = newMaterial;
  }

  /**
   * Factory method to create an Armor instance
   * @param id id of the armor
   * @param name name of the armor
   * @param description description of the armor
   * @param material material of the armor
   * @param weight weight of the armor
   * @param price price of the armor
   * @returns A new Armor instance
   */
  static createArmor(
    id: number,
    name: string,
    description: string,
    material: ArmorMaterial,
    weight: number,
    price: number,
  ): Armor {
    const prefixedId = `A-${id}`;
    return new Armor(prefixedId, name, description, material, weight, price);
  }
}

/**
 * Class representing a weapon item
 */
export class Weapon extends BaseItem {
  /**
   * Constructor for the Weapon class
   * @param id id of the weapon
   * @param name name of the weapon
   * @param description description of the weapon
   * @param _material material of the weapon
   * @param weight weight of the weapon
   * @param price price of the weapon
   */
  constructor(
    id: string,
    name: string,
    description: string,
    protected _material: WeaponMaterial,
    weight: number,
    price: number,
  ) {
    super(id, name, description, _material, weight, price);
  }

  /**
   * Getter for the material property
   * @returns The material of the weapon
   */
  get material(): WeaponMaterial {
    return this._material;
  }

  /**
   * Setter for the material property
   * @param newMaterial - The new material for the weapon
   */
  set material(newMaterial: WeaponMaterial) {
    this._material = newMaterial;
  }

  /**
   * Factory method to create a Weapon instance
   * @param id id of the weapon
   * @param name name of the weapon
   * @param description description of the weapon
   * @param material material of the weapon
   * @param weight weight of the weapon
   * @param price price of the weapon
   * @returns A new Weapon instance
   */
  static createWeapon(
    id: number,
    name: string,
    description: string,
    material: WeaponMaterial,
    weight: number,
    price: number,
  ): Weapon {
    const prefixedId = `W-${id}`;
    return new Weapon(prefixedId, name, description, material, weight, price);
  }
}

/**
 * Class representing a potion item
 */
export class Potion extends BaseItem {
  /**
   * Constructor for the Potion class
   * @param id id of the potion
   * @param name name of the potion
   * @param description description of the potion
   * @param _material material of the potion
   * @param weight weight of the potion
   * @param price price of the potion
   * @param _effect effect of the potion
   */
  constructor(
    id: string,
    name: string,
    description: string,
    protected _material: PotionMaterial,
    weight: number,
    price: number,
    protected _effect: Effect,
  ) {
    super(id, name, description, _material, weight, price);
  }

  /**
   * Getter for the material property
   * @returns The material of the potion
   */
  get material(): PotionMaterial {
    return this._material;
  }

  /**
   * Setter for the material property
   * @param newMaterial - The new material for the potion
   */
  set material(newMaterial: PotionMaterial) {
    this._material = newMaterial;
  }

  /**
   * Getter for the effect property
   * @returns The effect of the potion
   */
  get effect(): Effect {
    return this._effect;
  }

  /**
   * Setter for the effect property
   * @param newEffect - The new effect for the potion
   */
  set effect(newEffect: Effect) {
    this._effect = newEffect;
  }

  /**
   * Factory method to create a Potion instance
   * @param id id of the potion
   * @param name name of the potion
   * @param description description of the potion
   * @param material material of the potion
   * @param weight weight of the potion
   * @param price price of the potion
   * @param effect effect of the potion
   * @returns A new Potion instance
   */
  static createPotion(
    id: number,
    name: string,
    description: string,
    material: PotionMaterial,
    weight: number,
    price: number,
    effect: Effect,
  ): Potion {
    const prefixedId = `P-${id}`;
    return new Potion(
      prefixedId,
      name,
      description,
      material,
      weight,
      price,
      effect,
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      material: this.material,
      weight: this.weight,
      price: this.price,
      effect: this.effect,
    };
  }
}

/**
 * Type representing an item that can be an Armor, Weapon, or Potion
 */
export type Item = Armor | Weapon | Potion;
