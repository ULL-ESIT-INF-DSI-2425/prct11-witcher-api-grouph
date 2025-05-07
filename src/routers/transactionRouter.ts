import express from "express";
import { Types } from "mongoose";
import {
  Transaction,
  TransactionType,
  transactionTypeValues,
} from "../models/transaction.js";
export const transactionRouter: express.Router = express.Router();

interface TransactionFilter {
  type?: TransactionType;
  item?: Types.ObjectId | string;
  "performedBy.type"?: "Merchant" | "Hunter";
  "performedBy.id"?: Types.ObjectId | string;
}

transactionRouter.post("/transactions", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    return res.status(201).send(transaction);
  } catch {
    return res.status(400).send({
      error: "Failed to create transaction",
    });
  }
});

transactionRouter.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }
    return res.status(200).send(transaction);
  } catch {
    return res.status(500).send({
      error: "Failed to fetch transaction",
    });
  }
});

transactionRouter.get("/transactions", async (req, res) => {
  try {
    const { type, item, performedByType, performedById, startDate, endDate } = req.query;
    const filter: TransactionFilter = {};
    if (type) {
      if (!transactionTypeValues.includes(type as TransactionType)) {
        return res.status(400).send({ error: "Invalid transaction type" });
      }
      filter.type = type as TransactionType;
    }
    if (item) filter.item = item.toString();
    if (performedByType) {
      if (!["Merchant", "Hunter"].includes(performedByType.toString())) {
        return res.status(400).send({ error: "Invalid performer type" });
      }
      filter["performedBy.type"] = performedByType as "Merchant" | "Hunter";
    }
    if (performedById) filter["performedBy.id"] = performedById.toString();
    const transactions = await Transaction.find(filter)
      .populate({
        path: "item",
        select: "name",
      })
      .populate({
        path: "performedBy.id",
        select: "name",
        options: { strictPopulate: false },
      });
    if (!transactions.length) {
      const errorMessage = Object.keys(filter).length
        ? "No transactions match the criteria"
        : "No transactions found";
      return res.status(404).send({ error: errorMessage });
    }
    return res.status(200).send(transactions);
  } catch {
    return res.status(500).send({
      error: "Failed to fetch transactions",
    });
  }
});

transactionRouter.patch("/transactions/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["type", "item", "quantity", "performedBy", "date"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }
    return res.status(200).send(transaction);
  } catch {
    return res.status(500).send({
      error: "Failed to update transaction",
    });
  }
});

transactionRouter.delete("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).send({ error: "Transaction not found" });
    }
    return res.status(200).send(transaction);
  } catch {
    return res.status(500).send({
      error: "Failed to delete transaction",
    });
  }
});

transactionRouter.delete("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.deleteMany({});
    if (!transactions.deletedCount) {
      return res.status(404).send({ error: "No transactions to delete" });
    }
    return res.status(200).send({ message: "All transactions deleted" });
  } catch {
    return res.status(500).send({
      error: "Failed to delete transactions",
    });
  }
});