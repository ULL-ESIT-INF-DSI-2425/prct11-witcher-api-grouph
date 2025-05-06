import express from "express";
import { Merchant, Profession, ProfessionValues } from "../models/merchant.js";

export const merchantRouter: express.Router = express.Router();

interface MerchantFilter {
  profession?: Profession; 
  location?: string;
  name?: string;
}

merchantRouter.post("/merchants", async (req, res) => {
  try {
    const merchant = new Merchant(req.body);
    await merchant.save();
    return res.status(201).send(merchant);
  } catch {
    return res.status(400).send({
      error: "Failed to create merchant",
    });
  }
});

merchantRouter.get("/merchants", async (req, res) => {
  try {
    const { profession, location, name } = req.query;
    const filter: MerchantFilter = {};
    if (profession) {
      if (!ProfessionValues.includes(profession as Profession)) {
        return res.status(400).send({ error: "Invalid profession" });
      }
      filter.profession = profession as Profession;
    }
    if (location) filter.location = location as string;
    if (name) filter.name = name as string;
    const merchants = await Merchant.find(filter);
    if (!merchants.length) {
      const errorMessage = Object.keys(filter).length
        ? `No merchants found matching: ${Object.entries(filter)
            .map(([key, val]) => `${key}=${val}`)
            .join(", ")}`
        : "There are no merchants";
      return res.status(404).send({ error: errorMessage });
    }
    return res.status(200).send(merchants);
  } catch {
    return res.status(500).send({ error: "Failed to fetch merchants" });
  }
});

merchantRouter.get("/merchants/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).send({ error: "merchant not found" });
    }
    return res.status(200).send(merchant);
  } catch {
    return res.status(500).send({
      error: "Failed to fetch merchant",
    });
  }
});

merchantRouter.patch("/merchants/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "profession", "location"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update),
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
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
  } catch {
    return res.status(500).send({
      error: "Failed to update merchant",
    });
  }
});

merchantRouter.delete("/merchants/:id", async (req, res) => {
  try {
    const merchant = await Merchant.findByIdAndDelete(req.params.id);
    if (!merchant) {
      return res.status(404).send({ error: "merchant not found" });
    }
    return res.status(200).send(merchant);
  } catch {
    return res.status(500).send({
      error: "Failed to delete merchant",
    });
  }
});
