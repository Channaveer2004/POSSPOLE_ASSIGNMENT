// routes/profile.js
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js"; // <- corrected import

const router = express.Router();

// GET profile
router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

// UPDATE profile
router.put("/", requireAuth, async (req, res) => {
  const { name, phoneNumber, dateOfBirth, address, profilePictureUrl } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phoneNumber, dateOfBirth, address, profilePictureUrl },
    { new: true }
  ).select("-passwordHash");

  res.json(user);
});

// CHANGE password
router.put("/password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hashed;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

export default router;
