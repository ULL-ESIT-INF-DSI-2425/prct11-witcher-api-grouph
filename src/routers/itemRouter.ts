import express from 'express';
import { Weapon, Armor, Potion, Item } from '../models/item.js';

export const itemRouter: express.Router = express.Router();

itemRouter.get('/goods/:item', async (req, res) => {
  try {
    const items = await Item.findOne({ name: req.params.item });
    if (!items) {
      return res.status(404).send({ error: "There are no items" });
    }
    if (items instanceof Weapon) {
      return res.status(200).send({ type: "Weapon", item: items });
    }
    if (items instanceof Armor) {
      return res.status(200).send({ type: "Armor", item: items });
    }
    if (items instanceof Potion) {
      return res.status(200).send({ type: "Potion", item: items });
    }
    return res.status(200).send({ type: "Item", item: items });
  } catch (error) {
    return res.status(500).send(error);
  }
});
