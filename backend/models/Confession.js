import mongoose from "mongoose";

const ConfessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 50
    },
    department: {
      type: String,
      trim: true,
      maxLength: 50
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500
    },
    mood: {
      type: String,
      required: true,
      enum: ["Secret", "Love", "Crush", "Regret", "Funny"]
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Confession", ConfessionSchema);
