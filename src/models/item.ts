import { Document, connect, model, Schema } from 'mongoose';
import validator from 'validator';

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

interface ItemDocumentInterface extends Document {
  name: string;
  description: string;
  material: GenericMaterial
  weight: number;
  price: number;
  quantity: number;
}

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
}, { discriminatorKey: 'kind', collection: 'items' });

export const Item = model<ItemDocumentInterface>('Item', ItemSchema);


const WeaponSchema = new Schema<ItemDocumentInterface> ({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.WeaponMaterial,
  },
});

export const Weapon = Item.discriminator<ItemDocumentInterface>('Weapon', WeaponSchema);


const ArmorSchema = new Schema<ItemDocumentInterface> ({
  material: {
    type: String,
    required: true,
    enum: GenericMaterialValues.ArmorMaterial,
  },
});

export const Armor = Item.discriminator<ItemDocumentInterface>('Armor', ArmorSchema);

interface PotionDocumentInterface extends ItemDocumentInterface {
  effect: Effect;
}

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

export const Potion = Item.discriminator<PotionDocumentInterface>('Potion', PotionSchema);

/**
const sword = new Weapon({
  name: 'Sword',
  description: 'A sharp blade', 
  material: 'Steel',
  weight: 3,
  price: 100,
});

sword.save().then(() => {
  console.log('Sword saved');
  console.log(sword);
}).catch((error) => {
  console.error('Error saving sword:', error);
});

const armor = new Armor({
  name: 'Armor',
  description: 'A protective suit',
  material: 'Leather',
  weight: 10,
  price: 200,
});

armor.save().then(() => {
  console.log('Armor saved');
  console.log(armor);
}).catch((error) => {
  console.error('Error saving armor:', error);
});

const potion = new Potion({
  name: 'Healing Potion',
  description: 'Restores health',
  material: 'Mandrake',
  weight: 1,
  price: 50,
  effect: 'Heal',
});
potion.save().then(() => {
  console.log('Potion saved');
  console.log(potion);
}
).catch((error) => {
  console.error('Error saving potion:', error);
});
*/