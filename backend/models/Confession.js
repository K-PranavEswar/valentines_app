import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    nickname: { type: String, default: "Anonymous" },
    message: { type: String, required: true },
    mood: { type: String, default: "Secret" },
    likes: { type: Number, default: 0 },
    dateTag: { type: String, default: "14/02/2026" }
  },
  { timestamps: true }
);

export default mongoose.model("Confession", confessionSchema);
