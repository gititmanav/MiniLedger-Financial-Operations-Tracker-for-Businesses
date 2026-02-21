import { Router } from "express";
import { getDB } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = Router();

// CREATE expense
router.post("/", async (req, res) => {
  const { userId, amount, category, description, date } = req.body;

  if (!userId || !amount || !category) {
    return res
      .status(400)
      .json({ error: "userId, amount, and category are required." });
  }

  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number." });
  }

  try {
    const db = getDB();
    const result = await db.collection("expenses").insertOne({
      userId,
      amount: Number(amount),
      category,
      description: description || "",
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    });

    res.status(201).json({ _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all expenses (optionally filter by userId)
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;

    const records = await db
      .collection("expenses")
      .find(filter)
      .sort({ date: -1 })
      .toArray();

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single expense
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const record = await db
      .collection("expenses")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!record)
      return res.status(404).json({ error: "Expense record not found." });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE expense
router.put("/:id", async (req, res) => {
  const { amount, category, description, date } = req.body;

  try {
    const db = getDB();
    const updates = {};
    if (amount !== undefined) {
      if (isNaN(amount) || Number(amount) <= 0) {
        return res
          .status(400)
          .json({ error: "Amount must be a positive number." });
      }
      updates.amount = Number(amount);
    }
    if (category) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (date) updates.date = new Date(date);

    const result = await db
      .collection("expenses")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Expense record not found." });
    }

    res.json({ message: "Expense updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("expenses")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Expense record not found." });
    }

    res.json({ message: "Expense deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
