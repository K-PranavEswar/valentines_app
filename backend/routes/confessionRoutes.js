import express from "express";
import Confession from "../models/Confession.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, department, message, mood } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message required" });
    }

    if (!mood) {
      return res.status(400).json({ message: "Mood required" });
    }

    const newConfession = await Confession.create({
      name: name?.trim() || "",
      department: department?.trim() || "",
      message: message.trim(),
      mood
    });

    return res.status(201).json(newConfession);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    return res.json(confessions);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id/like", async (req, res) => {
  try {
    const updated = await Confession.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
