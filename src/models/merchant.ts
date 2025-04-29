import { Document, connect, model, Schema } from "mongoose";
import validator from "validator";

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

const ProfessionValues = [
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

const MerchantSchema = new Schema<MerchantDocumentInterface>({
  name: {
    type: String,
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

export const Merchant = model<MerchantDocumentInterface>("Merchants", MerchantSchema);

/*
const merchant = new Merchant({
  name: "Gremist",
  profession: "Druid",
  location: "Skellige",
});

merchant
  .save()
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
*/