import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { DEMO_USERS } from "../controller/user.controller.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also support Authorization header (Bearer <token>)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided", success: false });
    }

    const secret = process.env.JWT_SECRET_TOKEN || "medicare_jwt_secret_token_2026";
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token", success: false });
    }

    // 1. Check predefined demo users
    const demoFound = Object.values(DEMO_USERS).find((d) => d.id === decoded.userId || d._id === decoded.userId);
    if (demoFound) {
      req.user = {
        ...demoFound,
        role: demoFound.role === "user" ? "patient" : demoFound.role,
      };
      return next();
    }

    // 2. If running in offline / safe demo mode (userId starts with user- or no DB)
    if (String(decoded.userId).startsWith("user-") || decoded.role) {
      const normalizedRole = decoded.role === "user" ? "patient" : (decoded.role || "patient");
      req.user = {
        id: decoded.userId,
        _id: decoded.userId,
        username: decoded.username || (normalizedRole === "admin" ? "Medicare Administrator" : normalizedRole === "doctor" ? "Dr. Medical Specialist" : "Medicare Patient"),
        email: decoded.email || `${normalizedRole}@medicare.com`,
        role: normalizedRole,
        imageUrl: decoded.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      };
      return next();
    }

    // 3. Normal DB query
    const user = await User.findById(decoded.userId).select("-password").catch(() => null);

    if (!user) {
      return res.status(401).json({ message: "User not found or session invalid", success: false });
    }

    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.role === "user") {
      userObj.role = "patient";
    }

    req.user = userObj;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired or invalid token", success: false });
    }
    console.error("Auth middleware error: ", error);
    return res.status(500).json({ message: error.message || "Internal Server Error", success: false });
  }
};