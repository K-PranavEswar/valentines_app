import express from "express";
import jwt from "jsonwebtoken";
import Confession from "../models/Confession.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { admin: true, email: process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token });
});

router.delete("/confessions/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await Confession.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Confession not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
