import express from 'express';
import { Weapon, Armor, Potion, Item, GenericMaterialValues } from '../models/item.js';

export const itemRouter: express.Router = express.Router();

itemRouter.post('/goods', async (req, res) => {
  try {
    const { name, material, quantity = 1 } = req.body;
    const existingItem = await Item.findOne({ name, material });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).send(existingItem);
    }

    let item;
    if (material === GenericMaterialValues.WeaponMaterial) {
      item = new Weapon(req.body);
    } else if (material === GenericMaterialValues.ArmorMaterial) {
      item = new Armor(req.body);
    } else if (material === GenericMaterialValues.PotionMaterial) {
      item = new Potion(req.body);
    } else {
      item = new Item(req.body);
    }

    await item.save();
    return res.status(201).send(item);
  } catch (error) {
    return res.status(500).send(
      { message: 'An error occurred while creating the item', error }
    );
  }
});

itemRouter.get('/goods', async (req, res) => {
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

itemRouter.get('/goods/weapons', async (req, res) => {
  try {
    const weapons = await Weapon.find({});
    if (weapons.length === 0) {
      return res.status(404).send({ error: "There are no weapons" });
    }
    return res.status(200).send(weapons);
  } catch (error) {
    return res.status(500).send(error);
  }
});

itemRouter.get('/goods/armor', async (req, res) => {
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


itemRouter.get('/goods/potions', async (req, res) => {
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

itemRouter.get('/goods/:id', async (req, res) => {
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

// Actualizar item por ID
itemRouter.patch('/goods/:id', async (req, res) => {
  try {
    const allowedUpdates = ['name', 'description', 'material', 'weight', 'price'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, runValidators: true 
    });
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Eliminar item por ID
itemRouter.delete('/goods/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send({ error: "Item not found" });
    }
    return res.status(200).send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
});
