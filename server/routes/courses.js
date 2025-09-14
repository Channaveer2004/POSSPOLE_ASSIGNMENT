// routes/courses.js
import express from "express";
import Course from "../models/Course.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js"; // <- corrected

const router = express.Router();

// Admin: Add course
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { code, name, description } = req.body;
  const course = await Course.create({ code, name, description });
  res.json(course);
});

// Admin: Update course
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  res.json(course);
});

// Admin: Delete course
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
});

// All: Get courses (dropdown list)
router.get("/", requireAuth, async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

export default router;
