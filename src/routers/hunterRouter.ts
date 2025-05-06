import express from "express";
import { Hunter, RaceValues, Race } from "../models/hunter.js";

export const hunterRouter: express.Router = express.Router();

interface HunterFilter {
  race?: Race;
  location?: string;
  name?: string;
}

hunterRouter.post("/hunters", async (req, res) => {
  try {
    const { name } = req.body;
    const existingHunter = await Hunter.findOne({ name });
    if (existingHunter) {
      return res.status(409).json({
        error: "Hunter with this name already exists",
      });
    }
    const hunter = new Hunter(req.body);
    await hunter.save();
    return res.status(201).send(hunter);
  } catch {
    return res.status(400).json({
      error: "Failed to create hunter",
    });
  }
});

hunterRouter.get("/hunters", async (req, res) => {
  try {
    const { race, location, name } = req.query;
    const filter: HunterFilter = {};
    if (race) {
      if (!RaceValues.includes(race as Race)) {
        return res.status(400).send({ error: "Invalid profession" });
      }
      filter.race = race as Race;
    }
    if (location) filter.location = location as string;
    if (name) filter.name = name as string;
    const hunters = await Hunter.find(filter);
    if (!hunters.length) {
      const errorMessage = Object.keys(filter).length
        ? `No hunters found matching: ${Object.entries(filter)
            .map(([key, val]) => `${key}=${val}`)
            .join(", ")}`
        : "There are no hunters";
      return res.status(404).send({ error: errorMessage });
    }
    return res.status(200).send(hunters);
  } catch {
    return res.status(500).send({ error: "Failed to fetch hunters" });
  }
});

hunterRouter.get("/hunters/:id", async (req, res) => {
  try {
    const hunter = await Hunter.findById(req.params.id);
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch {
    return res.status(500).send({
      error: "Failed to fetch hunter",
    });
  }
});

hunterRouter.patch("/hunters/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "race", "location"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const hunter = await Hunter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch {
    return res.status(500).send({
      error: "Failed to update hunter",
    });
  }
});

hunterRouter.put("/hunters/:id", async (req, res) => {
  try {
    const hunter = await Hunter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch {
    return res.status(500).send({
      error: "Failed to update hunter",
    });
  }
});

hunterRouter.delete("/hunters/:id", async (req, res) => {
  try {
    const hunter = await Hunter.findByIdAndDelete(req.params.id);
    if (!hunter) {
      return res.status(404).send({ error: "Hunter not found" });
    }
    return res.status(200).send(hunter);
  } catch {
    return res.status(500).send({
      error: "Failed to delete hunter",
    });
  }
});

hunterRouter.delete("/hunters", async (req, res) => {
  try {
    const result = await Hunter.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "No hunters to delete" });
    }
    return res.status(200).send({ message: "All hunters deleted" });
  } catch {
    return res.status(500).send({
      error: "Failed to delete hunters",
    });
  }
});
