import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import confessionRoutes from "./routes/confessionRoutes.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
await connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://valentinesapp26.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Confession Wall 2026 API Running" });
});

app.use("/api/confessions", confessionRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
