import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    confessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Confession", required: true },
    name: { type: String, default: "Anonymous" },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
