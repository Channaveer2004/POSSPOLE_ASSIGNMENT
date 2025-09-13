import { Router } from "express";
const router = Router();
import { listCourses, createCourse, updateCourse, deleteCourse } from "../controllers/courseController.js";
import { authenticate as authMiddleware } from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

router.get("/", listCourses);

router.post("/", authMiddleware, adminMiddleware, createCourse);
router.put("/:id", authMiddleware, adminMiddleware, updateCourse);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourse);

export default router;
