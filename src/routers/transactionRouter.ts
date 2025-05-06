import express from "express";
import { Transaction } from "../models/transaction.js";

export const transactionRouter: express.Router = express.Router();

transactionRouter.post("/transactions", async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    return res.status(201).send(transaction);
  } catch {
    return res.status(400).send({
      error: "Failed to create transaction.",
    });
  }
});

transactionRouter.get('/transaction', async (req, res) => {
  try {
    const transaction = await Transaction.find({});
    if (!transaction.length) {
      return res.status(404).send({ error: "There are no transactions" });
    }
    return res.status(200).send(transaction);
  } catch {
    return res.status(500).send({
      error: 'Failed to fetch transactions',
    });
  }
});

transactionRouter.get('/transaction/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).send({ error: "transaction not found" });
    }
    return res.status(200).send(transaction);
  } catch {
    return res.status(500).send({
      error: 'Failed to fetch transaction',
    });
  }
});

transactionRouter.get('/transaction/race/:race', async (req, res) => {
  try {
    const transaction = await Transaction.find({ race: req.params.race });
    res.status(transaction.length ? 200 : 404).send(transaction.length ? transaction : { error: 'No transaction of that race found' });
  } catch (error) {
    res.status(500).send(error);
  }
});

transactionRouter.get('/transaction/location/:location', async (req, res) => {
  try {
    const transaction = await Transaction.find({ location: req.params.location });
    res.status(transaction.length ? 200 : 404).send(transaction.length ? transaction : { error: 'No transaction in that location' });
  } catch (error) {
    res.status(500).send(error);
  }
});

transactionRouter.patch('/transaction/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'race', 'location'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const hunter = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch {
    return res.status(500).send({
      error: 'Failed to update hunter',
    });
  }
});

transactionRouter.delete('/transaction/:id', async (req, res) => {
  try {
    const hunter = await Transaction.findByIdAndDelete(req.params.id);
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch {
    return res.status(500).send({
      error: 'Failed to delete hunter',
    });
  }
});
