// server/controllers/courseController.js
import Course from "../models/Course.js";

// Create Course
export async function createCourse(req, res) {
  try {
    const { title, code, description } = req.body;
    if (!title || !code) {
      return res.status(400).json({ message: "Title and code are required" });
    }

  const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "Course code already exists" });
    }

    const course = new Course({ title, code, description });
    await course.save();

    return res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Update Course
export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, code, description } = req.body;

  const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (code) {
  const existing = await Course.findOne({ code, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: "Course code already in use" });
      }
    }

    course.title = title ?? course.title;
    course.code = code ?? course.code;
    course.description = description ?? course.description;

    await course.save();
    return res.status(200).json(course);
  } catch (err) {
    console.error("Error updating course:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete Course
export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// List Courses
export async function listCourses(req, res) {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const filter = search
      ? { $or: [{ title: new RegExp(search, "i") }, { code: new RegExp(search, "i") }] }
      : {};

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      data: courses,
    });
  } catch (err) {
    console.error("Error listing courses:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
