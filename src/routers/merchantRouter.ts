import express from 'express';
import { Merchant } from '../models/merchant.js';

export const hunterRouter: express.Router = express.Router();

hunterRouter.post('/merchant', async (req, res) => {
  try {
    const hunter = new Merchant(req.body);
    await hunter.save();
    return res.status(201).send(hunter);
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to create hunter',
    });
  }
});

hunterRouter.get('/merchant', async (req, res) => {
  try {
    const hunters = await Merchant.find({});
    if (!hunters.length) {
      return res.status(404).send({ error: "There are no hunters" });
    }
    return res.status(200).send(hunters);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to fetch hunters',
    });
  }
});

hunterRouter.get('/merchant/:id', async (req, res) => {
  try {
    const hunter = await Merchant.findById(req.params.id);
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to fetch hunter',
    });
  }
});

hunterRouter.get('/merchant/race/:race', async (req, res) => {
  try {
    const hunters = await Merchant.find({ race: req.params.race });
    res.status(hunters.length ? 200 : 404).send(hunters.length ? hunters : { error: 'No hunters of that race found' });
  } catch (error) {
    res.status(500).send(error);
  }
});

hunterRouter.get('/merchant/location/:location', async (req, res) => {
  try {
    const hunters = await Merchant.find({ location: req.params.location });
    res.status(hunters.length ? 200 : 404).send(hunters.length ? hunters : { error: 'No hunters in that location' });
  } catch (error) {
    res.status(500).send(error);
  }
});

hunterRouter.patch('/merchant/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'race', 'location'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const hunter = await Merchant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to update hunter',
    });
  }
});

hunterRouter.delete('/merchant/:id', async (req, res) => {
  try {
    const hunter = await Merchant.findByIdAndDelete(req.params.id);
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch (error) {
    return res.status(500).send({
      error: 'Failed to delete hunter',
    });
  }
});