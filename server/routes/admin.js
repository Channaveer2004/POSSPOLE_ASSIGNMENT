import express from "express";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import Course from "../models/Course.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.js"; // <- corrected
import { exportToCSV } from "../utils/csv.js";

const router = express.Router();

// Dashboard stats
router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  const totalFeedback = await Feedback.countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalCourses = await Course.countDocuments();

  res.json({ totalFeedback, totalStudents, totalCourses });
});

// Manage students
router.get("/students", requireAuth, requireAdmin, async (req, res) => {
  const students = await User.find({ role: "student" }).select("-passwordHash");
  res.json(students);
});

router.put("/students/:id/block", requireAuth, requireAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
  res.json(user);
});

router.put("/students/:id/unblock", requireAuth, requireAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
  res.json(user);
});

router.delete("/students/:id", requireAuth, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// Feedback trends (average rating per course)
router.get("/feedback-trends", requireAuth, requireAdmin, async (req, res) => {
  const trends = await Feedback.aggregate([
    { $group: { _id: "$course", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    { $unwind: "$course" },
    { $project: { course: "$course.name", avgRating: 1, count: 1 } },
  ]);

  res.json(trends);
});

// Export feedback CSV
router.get("/export-feedback", requireAuth, requireAdmin, async (req, res) => {
  const feedbacks = await Feedback.find()
    .populate("student", "name email") // <- corrected from "user"
    .populate("course", "name code");

  const csv = exportToCSV(feedbacks);
  res.header("Content-Type", "text/csv");
  res.attachment("feedbacks.csv");
  return res.send(csv);
});

export default router;
