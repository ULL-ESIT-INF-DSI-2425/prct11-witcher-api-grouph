import express from 'express';
import { Client } from '../models/hunter.js';

export const hunterRouter: express.Router = express.Router();

hunterRouter.post('/hunters', async (req, res) => {
  try {
    const hunter = new Client(req.body);
    await hunter.save();
    return res.status(201).send(hunter);
  } catch (error) {
    return res.status(400).send({
      error: 'Failed to create hunter',
    });
  }
});

hunterRouter.get('/hunters', async (req, res) => {
  try {
    const hunters = await Client.find({});
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

hunterRouter.get('/hunters/:id', async (req, res) => {
  try {
    const hunter = await Client.findById(req.params.id);
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

hunterRouter.get('/hunters/race/:race', async (req, res) => {
  try {
    const hunters = await Client.find({ race: req.params.race });
    res.status(hunters.length ? 200 : 404).send(hunters.length ? hunters : { error: 'No hunters of that race found' });
  } catch (error) {
    res.status(500).send(error);
  }
});

hunterRouter.get('/hunters/location/:location', async (req, res) => {
  try {
    const hunters = await Client.find({ location: req.params.location });
    res.status(hunters.length ? 200 : 404).send(hunters.length ? hunters : { error: 'No hunters in that location' });
  } catch (error) {
    res.status(500).send(error);
  }
});

hunterRouter.patch('/hunters/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'race', 'location'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const hunter = await Client.findByIdAndUpdate(req.params.id, req.body, {
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

hunterRouter.delete('/hunters/:id', async (req, res) => {
  try {
    const hunter = await Client.findByIdAndDelete(req.params.id);
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