import { Document, model, Schema } from "mongoose";
import validator from "validator";

/**
 * Represents the possible professions that a merchant can have.
 * These professions determine the type of items the merchant may sell or trade.
 *
 * @example
 * ```ts
 * const prof: Profession = "Alchemist";
 * ```
 */
export type Profession =
  | "Blacksmith"
  | "Alchemist"
  | "General Merchant"
  | "Butcher"
  | "Druid"
  | "Smuggler";

/**
 * Constant array of all valid profession values.
 * Useful for enum validation or UI dropdowns.
 *
 * @see Profession
 */
export const ProfessionValues = [
  "Blacksmith",
  "Alchemist",
  "General Merchant",
  "Butcher",
  "Druid",
  "Smuggler",
] as const;
interface MerchantDocumentInterface extends Document {
  name: string;
  profession: Profession;
  location: string;
}

/**
 * Mongoose schema for merchants, enforcing validations and constraints on the data.
 *
 * @see MerchantDocumentInterface
 * @throws {ValidationError} If the name doesn't start with a capital letter or the location is empty.
 * @default location "Novigrado"
 */
const MerchantSchema = new Schema<MerchantDocumentInterface>({
  name: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value: string) => /^[A-Z]/.test(value),
      message: "Name must start with a capital letter",
    },
  },
  profession: {
    type: String,
    required: true,
    enum: {
      values: ProfessionValues,
      message: "Profession is not valid",
    },
  },
  location: {
    type: String,
    default: "Novigrado",
    validate: {
      validator: (value: string) => value.trim().length > 0,
      message: "Location must not be empty",
    },
  },
});

/**
 * Mongoose model for merchant documents.
 * Provides access to database operations like `.find()`, `.save()`, etc.
 *
 * @example
 * ```ts
 * const merchant = new Merchant({
 *   name: "Gremist",
 *   profession: "Druid",
 *   location: "Skellige"
 * });
 *
 * merchant.save().then(result => console.log(result));
 * ```
 */
export const Merchant = model<MerchantDocumentInterface>(
  "Merchant",
  MerchantSchema,
);
