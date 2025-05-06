import { Document, model, Schema } from 'mongoose';
import validator from 'validator';

/**
 * Represents the possible materials used in weapons.
 * @category Types
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
 * Represents the possible materials used in armor.
 * @category Types
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
 * Represents the possible ingredients used in potions.
 * @category Types
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
 * Represents any material type for an item, including weapons, armors, or potions.
 * @category Types
 */
export type GenericMaterial = ArmorMaterial | WeaponMaterial | PotionMaterial;

/**
 * Object containing all valid values for each type of material.
 * @readonly
 * @category Constants
 */
export const GenericMaterialValues = {
  ArmorMaterial: [
    "Leather",
    "Hardened Leather",
    "Steel Mesh",
    "Silver Mesh",
    "Dragon Scales",
    "Adamantite Plates",
    "Mithril",
    "Enchanted Fabric",
    "Monster Bone",
    "Insectoid Chitin",
  ],
  WeaponMaterial: [
    "Steel",
    "Elven Steel",
    "Meteoric Steel",
    "Silver",
    "Reinforced Silver",
    "Ebony Wood",
    "Monster Bone",
    "Volcanic Glass",
    "Mithril",
    "Adamantite",
  ],
  PotionMaterial: [
    "Celandine Flower",
    "Mandrake",
    "Vervain",
    "Bryonia Root",
    "Crushed Kikimora Skull",
    "Nekker Gland",
    "Wraith Essence",
    "Griffin Marrow",
    "Endrega Mucus",
    "Ghoul Blood",
  ],
} as const;

/**
 * Represents the possible magical effects a potion can produce.
 * @category Types
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
 * Object containing all valid values for potion effects.
 * @readonly
 * @category Constants
 */
export const EffectValues = {
  VitalityRegeneration: "Vitality Regeneration",
  NightVision: "Night Vision",
  PoisonResistance: "Poison Resistance",
  StrengthBoost: "Strength Boost",
  SpeedBoost: "Speed Boost",
  IncreasedSignDamage: "Increased Sign Damage",
  ToxicityReduction: "Toxicity Reduction",
  InvisibleCreatureDetection: "Invisible Creature Detection",
  TemporaryEnemyParalysis: "Temporary Enemy Paralysis",
  LifeAbsorption: "Life Absorption",
  UnknownEffect: "Unknown Effect",
} as const;

/**
 * Interface for the base item document in MongoDB.
 * @interface ItemDocumentInterface
 * @property {string} name - The name of the item.
 * @property {string} description - The description of the item.
 * @property {GenericMaterial} material - The material of the item, which can be a weapon, armor, or potion.
 * @property {number} weight - The weight of the item.
 * @property {number} price - The price of the item.
 * @property {number} quantity - The quantity of the item.
 * @category Models
 * @extends Document
 */
interface ItemDocumentInterface extends Document {
  name: string;
  kind: string;
  description: string;
  material: GenericMaterial
  weight: number;
  price: number;
  quantity: number;
}

/**
 * Base schema for items. Used as the parent schema for weapons, armor, and potions.
 * @remarks Uses `discriminatorKey` to allow subtype differentiation.
 */
const ItemSchema = new Schema<ItemDocumentInterface>({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Item name must not be empty',
    },
    unique: true,
  },
  kind: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Item kind must not be empty',
    },
    unique: true,
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Item description must not be empty',
    },
    unique: true,
  },
  material: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Item material must not be empty',
    },
  },
  weight: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => validator.isFloat(value.toString(), { gt: 0 }),
      message: 'Item weight must be greater than 0',
    },
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => validator.isFloat(value.toString(), { gt: 0 }),
      message: 'Item price must be greater than 0',
    },
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    validate: {
      validator: (value: number) => validator.isInt(value.toString(), { gt: 0 }),
      message: 'Item quantity must be greater than 0',
    },
  },
}, { discriminatorKey: 'kind', collection: 'item' });

/**
 * Base model for all items.
 * @category Models
 */
export const Item = model<ItemDocumentInterface>('Item', ItemSchema);

/**
 * Schema and model for weapon-type items.
 * @category Models
 */
const WeaponSchema = new Schema<ItemDocumentInterface> ({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.WeaponMaterial,
  },
});

/**
 * Mongoose discriminator for weapons, inheriting from Item.
 */
export const Weapon = Item.discriminator<ItemDocumentInterface>('Weapon', WeaponSchema);

/**
 * Schema and model for armor-type items.
 * @category Models
 */
const ArmorSchema = new Schema<ItemDocumentInterface> ({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.ArmorMaterial,
  },
});

/**
 * Mongoose discriminator for armors, inheriting from Item.
 */
export const Armor = Item.discriminator<ItemDocumentInterface>('Armor', ArmorSchema);

/**
 * Interface for potion documents, extending from Item and adding `effect`.
 * @interface
 * @extends ItemDocumentInterface
 */
interface PotionDocumentInterface extends ItemDocumentInterface {
  effect: Effect;
}

/**
 * Schema and model for potion-type items.
 * @category Models
 */
const PotionSchema = new Schema<PotionDocumentInterface>({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.PotionMaterial,
  },
  effect: {
    type: String,
    required: true,
    enum: Object.values(EffectValues),
    default: EffectValues.UnknownEffect,
    validate: {
      validator: (value: string) => !validator.isEmpty(value, { ignore_whitespace: true }),
      message: 'Potion effect must not be empty',
    },
  },
});

/**
 * Mongoose discriminator for potions, inheriting from Item.
 */
export const Potion = Item.discriminator<PotionDocumentInterface>('Potion', PotionSchema);
