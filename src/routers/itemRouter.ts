import express from "express";
import {
  Weapon,
  Armor,
  Potion,
  Item,
} from "../models/item.js";

export const itemRouter: express.Router = express.Router();

itemRouter.post("/goods", async (req, res) => {
  try {
    const { name, kind, material, quantity = 1 } = req.body;
    const existingItem = await Item.findOne({ name, material });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).send(existingItem);
    }

    if (!kind) {
      return res.status(400).json({ error: "Kind is required" });
    }

    let item;
    if (kind === "Weapon") {
      item = new Weapon(req.body);
    } else if (kind === "Armor") {
      item = new Armor(req.body);
    } else if (kind === "Potion") {
      item = new Potion(req.body);
    } else {
      return res.status(400).json({ error: "Invalid kind" });
    }

    await item.save();
    return res.status(201).send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.get("/goods", async (req, res) => {
  try {
    const items = await Item.find({});
    if (!items.length) {
      return res.status(404).send({ error: "There are no items" });
    }
    return res.status(200).send(items);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.get("/goods/weapon", async (req, res) => {
  try {
    const query = req.query;
    const weapons = await Weapon.find(query);
    if (weapons.length === 0) {
      return res.status(404).send({ error: "There are no weapons" });
    }
    return res.status(200).send(weapons);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.get("/goods/armor", async (req, res) => {
  try {
    const armors = await Armor.find({});
    if (armors.length === 0) {
      return res.status(404).send({ error: "There are no armors" });
    }
    return res.status(200).send(armors);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.get("/goods/potion", async (req, res) => {
  try {
    const potions = await Potion.find({});
    if (potions.length === 0) {
      return res.status(404).send({ error: "There are no potions" });
    }
    return res.status(200).send(potions);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.get("/goods/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.patch("/goods/:id", async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "description",
      "material",
      "weight",
      "price",
      "quantity",
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.delete("/goods/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    if (item.quantity > 1) {
      item.quantity -= 1;
      await item.save();
      return res.status(200).send({ message: "Item quantity decreased", item });
    } else {
      await item.deleteOne();
      return res.status(200).send({ message: "Item deleted", item });
    }
  } catch {
    return res.status(500).send({ error: "Error deleting item" });
  }
});
