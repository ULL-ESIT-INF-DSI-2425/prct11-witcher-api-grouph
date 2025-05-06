import express from 'express';
import { Merchant } from '../models/merchant.js';

export const merchantRouter: express.Router = express.Router();

merchantRouter.post('/merchant', async (req, res) => {
  try {
    const merchant = new Merchant(req.body);
    await merchant.save();
    return res.status(201).send(merchant);
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to create merchant',
    });
  }
});

merchantRouter.get('/merchant', async (req, res) => {
  try {
    const merchants = await Merchant.find({});
    if (!merchants.length) {
      return res.status(404).send({ error: "There are no merchants" });
    }
    return res.status(200).send(merchants);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to fetch merchants',
    });
  }
});

merchantRouter.get('/merchant/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).send({ error: "merchant not found" });
    }
    return res.status(200).send(merchant);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to fetch merchant',
    });
  }
});

merchantRouter.get('/merchant/profession/:profession', async (req, res) => {
  try {
    const merchants = await Merchant.find({ profession: req.params.profession });
    res.status(merchants.length ? 200 : 404).send(merchants.length ? merchants : { error: 'No merchants of that race found' });
  } catch (error) {
    res.status(500).send(error);
  }
});

merchantRouter.get('/merchant/location/:location', async (req, res) => {
  try {
    const merchants = await Merchant.find({ location: req.params.location });
    res.status(merchants.length ? 200 : 404).send(merchants.length ? merchants : { error: 'No merchants in that location' });
  } catch (error) {
    res.status(500).send(error);
  }
});

merchantRouter.patch('/merchant/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'profession', 'location'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const merchant = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!merchant) {
      return res.status(404).send({ error: "merchant not found" });
    }
    return res.status(200).send(merchant);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to update merchant',
    });
  }
});

merchantRouter.delete('/merchant/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndDelete(req.params.id);
    if (!merchant) {
      return res.status(404).send({ error: "merchant not found" });
    }
    return res.status(200).send(merchant);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to delete merchant',
    });
  }
});