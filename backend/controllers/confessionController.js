import Confession from "../models/Confession.js";
import Comment from "../models/Comment.js";

// --- CREATE CONFESSION ---
export const createConfession = async (req, res) => {
  try {
    const closeAfter = new Date("2026-02-15T00:00:00.000Z");
    const now = new Date();

    if (now >= closeAfter) {
      return res.status(403).json({ message: "Confessions are closed after 14/02/2026" });
    }

    // 1. EXTRACT ALL FIELDS FROM REQUEST
    const { nickname, message, mood, name, department } = req.body;

    if (!message || message.trim().length < 3) {
      return res.status(400).json({ message: "Message too short" });
    }

    // 2. CREATE THE DATABASE ENTRY
    const confession = await Confession.create({
      nickname: nickname?.trim() ? nickname.trim() : "Anonymous",
      message: message.trim(),
      mood: mood?.trim() ? mood.trim() : "Secret",
      
      // --- THIS PART WAS MISSING ---
      name: name?.trim() ? name.trim() : "Anonymous",
      department: department?.trim() ? department.trim() : "Unknown Dept"
      // -----------------------------
    });

    res.json(confession);
  } catch (err) {
    console.error("Error creating confession:", err); 
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET CONFESSIONS ---
export const getConfessions = async (req, res) => {
  try {
    const { mood, search } = req.query;
    const query = {};

    if (mood && mood !== "All") query.mood = mood;
    
    // 3. ENABLE SEARCH FOR NAME/DEPT
    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { message: regex },
        { name: regex },       
        { department: regex }  
      ];
    }

    const confessions = await Confession.find(query).sort({ createdAt: -1 });
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- LIKE CONFESSION ---
export const likeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ message: "Not found" });

    confession.likes += 1;
    await confession.save();
    res.json(confession);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- ADD COMMENT ---
export const addComment = async (req, res) => {
  try {
    const { name, text } = req.body;
    if (!text || text.trim().length < 1) {
      return res.status(400).json({ message: "Empty comment" });
    }

    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ message: "Confession not found" });

    const comment = await Comment.create({
      confessionId: req.params.id,
      name: name?.trim() ? name.trim() : "Anonymous",
      text: text.trim()
    });

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET COMMENTS ---
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ confessionId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- DELETE CONFESSION ---
export const deleteConfession = async (req, res) => {
  try {
    await Comment.deleteMany({ confessionId: req.params.id });
    await Confession.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};