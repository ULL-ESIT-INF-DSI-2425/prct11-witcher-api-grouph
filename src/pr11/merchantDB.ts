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

connect("mongodb://127.0.0.1:27017/inn-app")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Something went wrong when conecting to the database");
  });

interface MerchantDocumentInterface extends Document {
  name: string;
  profession: Profession;
  location: string;
}

const MerchantSchema = new Schema<MerchantDocumentInterface>({
  name: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error("Name must start with a capital letter");
        // } else if (!validator.default.isAlphanumeric(value)) {
        //   throw new Error("Merchant title must contain alphanumeric characters only");
        // }
      }
    },
  },
  profession: {
    type: String,
    required: true,
    enum: [
      "Blacksmith",
      "Alchemist",
      "General Merchant",
      "Butcher",
      "Druid",
      "Smuggler",
    ],
  },
  location: {
    type: String,
    default: "Novigrado",
  },
});

const Merchant = model<MerchantDocumentInterface>("Merchants", MerchantSchema);

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
