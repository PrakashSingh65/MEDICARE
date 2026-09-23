import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { DEMO_USERS } from "../controller/user.controller.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN || "default_jwt_secret");
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token", success: false });
    }

    // Check demo users first
    const demoFound = Object.values(DEMO_USERS).find((d) => d.id === decoded.userId);
    if (demoFound) {
      req.user = demoFound;
      return next();
    }

    // If userId starts with user- (offline demo user)
    if (String(decoded.userId).startsWith("user-")) {
      req.user = {
        id: decoded.userId,
        username: "Medicare Member",
        email: "member@medicare.com",
        role: "user",
      };
      return next();
    }

    // Normal DB query
    const user = await User.findById(decoded.userId).select("-password").catch(() => null);

    if (!user) {
      return res.status(401).json({ message: "User not found or session invalid", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired or invalid token", success: false });
    }
    console.error("Auth middleware error: ", error);
    return res.status(500).json({ message: error.message || "Internal Server Error", success: false });
  }
};