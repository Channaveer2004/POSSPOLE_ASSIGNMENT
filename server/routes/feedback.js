// routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";
import Course from "../models/Course.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Student: Submit feedback
router.post("/", requireAuth, async (req, res) => {
  try {
    const { courseId, rating, message } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const feedback = await Feedback.create({
      user: req.user.id, // matches schema
      course: courseId,
      rating,
      message,
    });

    res.json(feedback);
  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

// Student: View my feedbacks (paginated)
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({ user: req.user.id })
      .populate("course", "name code")
      .skip(skip)
      .limit(limit);

    res.json(feedbacks);
  } catch (err) {
    console.error("Get my feedbacks error:", err);
    res.status(500).json({ message: "Failed to load feedbacks" });
  }
});

// Student: Edit own feedback
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ _id: req.params.id, user: req.user.id });
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    const { rating, message } = req.body;
    feedback.rating = rating ?? feedback.rating;
    feedback.message = message ?? feedback.message;
    await feedback.save();

    res.json(feedback);
  } catch (err) {
    console.error("Edit feedback error:", err);
    res.status(500).json({ message: "Failed to update feedback" });
  }
});

// Student: Delete own feedback
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ message: "Failed to delete feedback" });
  }
});

// Admin: View all feedbacks (filter + search)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { course, rating, student } = req.query;
    let query = {};

    if (course) query.course = course;
    if (rating) query.rating = rating;
    if (student) query.user = student; // matches schema

    const feedbacks = await Feedback.find(query)
      .populate("user", "name email") // matches schema
      .populate("course", "name code");

    res.json(feedbacks);
  } catch (err) {
    console.error("Admin get feedbacks error:", err);
    res.status(500).json({ message: "Failed to load feedbacks" });
  }
});

export default router;
