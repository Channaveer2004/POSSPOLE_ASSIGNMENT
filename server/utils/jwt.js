// utils/jwt.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// hash refresh token before saving
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken };
