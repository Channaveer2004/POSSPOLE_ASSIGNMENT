import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import { authenticate, authorize } from "./middlewares/authMiddleware.js";
import cors from "cors";
import courseRoutes from "./routes/courseRoutes.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/feedback-app";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("API is running. Use /api/auth/signup or /api/auth/login");
});

// Student-only route
app.get("/api/student/profile", authenticate, authorize(["student", "admin"]), (req, res) => {
  res.json({ message: "Hello Student", user: req.user });
});

// Admin-only route
app.get("/api/admin/dashboard", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin 🚀", user: req.user });
});