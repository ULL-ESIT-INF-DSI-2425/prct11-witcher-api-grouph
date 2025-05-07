import { Document, model, Schema, Types } from "mongoose";
import validator from "validator";

/**
 * Enum-like type representing the possible transaction types.
 *
 * @example
 * ```ts
 * const t: TransactionType = "Sale";
 * ```
 */
export type TransactionType = "Purchase" | "Sale" | "Return";

/**
 * Constant array with all valid transaction type values.
 *
 * @see TransactionType
 */
export const transactionTypeValues = ["Purchase", "Sale", "Return"] as const;

/**
 * Interface for a transaction document in MongoDB.
 *
 * @interface
 * @extends Document
 *
 * @property type - The type of transaction. Must be one of `transactionTypeValues`.
 * @property item - The reference to the item involved in the transaction.
 * @property quantity - The number of items involved. Must be greater than 0.
 * @property performedBy - Who performed the transaction: either a Merchant or a Client.
 * @property date - The date when the transaction was made. Must not be in the future.
 *
 * @example
 * ```ts
 * const transaction: TransactionDocumentInterface = {
 *   type: "Purchase",
 *   item: new Types.ObjectId("..."),
 *   quantity: 2,
 *   performedBy: {
 *     type: "Merchant",
 *     id: new Types.ObjectId("...")
 *   },
 *   date: new Date("2024-01-01")
 * };
 * ```
 */
export interface TransactionDocumentInterface extends Document {
  type: TransactionType;
  item: Types.ObjectId;
  quantity: number;
  performedBy: {
    type: "Merchant" | "Hunter";
    id: Types.ObjectId;
  };
  date: Date;
}

/**
 * Mongoose schema for storing transactions in the database.
 * It validates each field to ensure data integrity.
 *
 * @throws {ValidationError} If `type` is invalid, `quantity` ≤ 0, `performedBy` has an invalid type, or `date` is in the future.
 *
 * @default date `Date.now`
 */
const TransactionSchema = new Schema<TransactionDocumentInterface>({
  type: {
    type: String,
    required: true,
    enum: {
      values: transactionTypeValues,
      message: "Transaction type is not valid. Must be one of: Purchase, Sale or Return",
    },
  },
  item: {
    type: Schema.ObjectId,
    required: true,
    ref: "Item",
    validate: {
      validator: (value: Types.ObjectId) => Types.ObjectId.isValid(value),
      message: "Item ID is not valid",
    }
  },
    quantity: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value > 0,
      message: "Quantity must be greater than 0",
    },
  },
  performedBy: {
    type: {
      type: String,
      required: true,
      enum: {
        values: ["Merchant", "Hunter"],
        message: "Performed by must be either Merchant or Hunter",
      },
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "performedBy.type",
      validate: {
        validator: (value: Types.ObjectId) => Types.ObjectId.isValid(value),
        message: "Performed by ID is not valid",
      }
    },
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    validate: {
      validator: (value: Date) => value <= new Date(),
      message: "Date must be in the past",
    },
  },
});

/**
 * Mongoose model for transaction documents.
 * Allows interaction with the `Transaction` collection.
 *
 * @example
 * ```ts
 * const transaction = new Transaction({
 *   type: "Sale",
 *   item: someItemId,
 *   quantity: 3,
 *   performedBy: {
 *     type: "Client",
 *     id: someClientId
 *   }
 * });
 *
 * await transaction.save();
 * ```
 */
export const Transaction = model<TransactionDocumentInterface>(
  "Transaction",
  TransactionSchema,
);
