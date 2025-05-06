import { Document, model, Schema, Types } from 'mongoose';
import validator from 'validator';

type transactionType = "Purchase" | "Sale" | "Return";

const transactionTypeValues = [ "Purchase", "Sale", "Return" ] as const;

interface TransactionDocumentInterface extends Document {
  type: transactionType;
  item: Types.ObjectId;
  quantity: number;
  performedBy: {
    type: "Merchant" | "Client";
    id: Types.ObjectId;
  };
  date: Date;
}

const TransactionSchema = new Schema<TransactionDocumentInterface>({
  type: {
    type: String,
    required: true,
    enum: {
      values: transactionTypeValues,
      message: "Transaction type is not valid",
    },
  },
  item: {
    type: Schema.ObjectId,
    required: true,
    ref: "Items",
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
        values: [ "Merchant", "Client" ],
        message: "Performed by type is not valid",
      },
    },
    id: {
      type: Schema.ObjectId,
      required: true,
      refPath: "performedBy.type",
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

export const Transaction = model<TransactionDocumentInterface>("Transactions", TransactionSchema);