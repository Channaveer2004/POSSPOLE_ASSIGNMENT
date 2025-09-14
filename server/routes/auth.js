import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { signAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from "../utils/jwt.js";

const router = express.Router();

const passwordRegex = /(?=.*[0-9])(?=.*[!@#$%^&*])/; // at least one number and one special char

const signupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(passwordRegex).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


function setRefreshCookie(res, token) {
  const cookieName = process.env.COOKIE_NAME || "refresh_token";
  const secure = process.env.COOKIE_SECURE === "true";
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/api/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 7, // fallback 7 days
  });
}


router.post("/signup", async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, password } = value;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ name, email, passwordHash }); // default role = student
  
    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + parseRefreshExpiresMs(process.env.REFRESH_TOKEN_EXPIRES_IN));
    await RefreshToken.create({
      user: user._id,
      tokenHash,
      userAgent: req.get("User-Agent") || "",
      ip: req.ip,
      expiresAt,
    });

   
    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (user.isBlocked) return res.status(403).json({ error: "Account is blocked" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + parseRefreshExpiresMs(process.env.REFRESH_TOKEN_EXPIRES_IN));
    await RefreshToken.create({
      user: user._id,
      tokenHash,
      userAgent: req.get("User-Agent") || "",
      ip: req.ip,
      expiresAt,
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/refresh", async (req, res) => {
  try {
    const cookieName = process.env.COOKIE_NAME || "refresh_token";
    let token = req.cookies?.[cookieName] || req.body?.refreshToken;
    if (!token) return res.status(401).json({ error: "Missing refresh token" });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const tokenHash = hashToken(token);
    const stored = await RefreshToken.findOne({ user: payload.userId, tokenHash });
    if (!stored) return res.status(401).json({ error: "Refresh token not recognized" });
    if (stored.expiresAt < new Date()) {
      await stored.deleteOne();
      return res.status(401).json({ error: "Refresh token expired" });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.isBlocked) return res.status(403).json({ error: "Account is blocked" });

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });

    res.json({ accessToken });
  } catch (err) {
    console.error("refresh error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/logout", async (req, res) => {
  try {
    const cookieName = process.env.COOKIE_NAME || "refresh_token";
    const token = req.cookies?.[cookieName] || req.body?.refreshToken;
    if (token) {
      const tokenHash = hashToken(token);
      await RefreshToken.deleteMany({ tokenHash });
    }
    res.clearCookie(cookieName, { path: "/api/auth/refresh", domain: process.env.COOKIE_DOMAIN || undefined });
    res.json({ ok: true });
  } catch (err) {
    console.error("logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


function parseRefreshExpiresMs(spec) {
  if (!spec) return 7 * 24 * 60 * 60 * 1000;
  const m = /^(\d+)([smhd])$/.exec(spec);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const val = Number(m[1]);
  const unit = m[2];
  switch (unit) {
    case "s":
      return val * 1000;
    case "m":
      return val * 60 * 1000;
    case "h":
      return val * 60 * 60 * 1000;
    case "d":
    default:
      return val * 24 * 60 * 60 * 1000;
  }
}

export default router;
