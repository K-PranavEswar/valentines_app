import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  createConfession,
  getConfessions,
  likeConfession,
  addComment,
  getComments,
  deleteConfession
} from "../controllers/confessionController.js";

const router = express.Router();

router.post("/", createConfession);
router.get("/", getConfessions);
router.put("/:id/like", likeConfession);

router.post("/:id/comments", addComment);
router.get("/:id/comments", getComments);

router.delete("/:id", adminAuth, deleteConfession);

export default router;
