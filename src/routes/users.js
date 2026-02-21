import { Router } from "express";
import { getDB } from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = Router();

// CREATE user
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    const db = getDB();
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const result = await db.collection("users").insertOne({
      name,
      email,
      password,
      createdAt: new Date(),
    });

    res.status(201).json({ _id: result.insertedId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  try {
    const db = getDB();
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }
      );

    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const { name, email } = req.body;

  if (!name && !email) {
    return res
      .status(400)
      .json({ error: "Provide at least name or email to update." });
  }

  try {
    const db = getDB();
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const db = getDB();
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
