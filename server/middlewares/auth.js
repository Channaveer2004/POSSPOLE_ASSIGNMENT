import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";


export const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = auth.split(" ")[1];
    const payload = verifyAccessToken(token);
    if (!payload || !payload.userId) return res.status(401).json({ error: "Invalid token" });

    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) return res.status(401).json({ error: "User not found" });
    if (user.isBlocked) return res.status(403).json({ error: "Account is blocked" });

    req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    if (err.name === "TokenExpiredError") return res.status(401).json({ error: "Access token expired" });
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const requireRole = (roleOrRoles) => {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden: insufficient role" });
    next();
  };
};

export const requireAdmin = requireRole("admin");
