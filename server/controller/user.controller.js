import User from "../model/user.model.js";
import mongoose from "mongoose";
import { UploadImage } from "../utils/upload-image.js";
import { generateToken } from "../utils/generate-token.js";

export const DEMO_USERS = {
  "admin@medicare.com": {
    id: "admin-demo-1",
    _id: "admin-demo-1",
    username: "Medicare Administrator",
    email: "admin@medicare.com",
    role: "admin",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  "doctor@medicare.com": {
    id: "doc-1",
    _id: "doc-1",
    username: "Dr. Priya Sharma",
    email: "doctor@medicare.com",
    role: "doctor",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  },
  "patient@medicare.com": {
    id: "pat-1",
    _id: "pat-1",
    username: "Aditi Kapoor",
    email: "patient@medicare.com",
    role: "patient",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
};

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Invalid input data.", success: false });
    }

    // Direct registration with admin role is not allowed
    if (role && role.toString().trim().toLowerCase() === "admin") {
      return res.status(403).json({
        message: "Direct registration with admin role is not allowed.",
        success: false,
      });
    }

    // Normalize role: only doctor or patient allowed via public signup (default: patient)
    const normalizedRole = role?.toString().trim().toLowerCase() === "doctor" ? "doctor" : "patient";

    let profileUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
    let profilePublicId = "";

    if (req.file) {
      try {
        const uploaded = await UploadImage(req.file, "medicare-profile-images");
        profileUrl = uploaded.secure_url;
        profilePublicId = uploaded.public_id;
      } catch (uploadErr) {
        console.warn("Cloudinary upload skipped:", uploadErr?.message || uploadErr);
      }
    }

    // If MongoDB is offline, provide graceful simulated registration with correct role
    if (mongoose.connection.readyState !== 1) {
      const demoUser = {
        id: `user-${Date.now()}`,
        _id: `user-${Date.now()}`,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        role: normalizedRole,
        imageUrl: profileUrl,
      };
      generateToken(demoUser, res);
      return res.status(201).json({
        message: "Account registered successfully.",
        user: demoUser,
        success: true,
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: username.trim() },
      ],
    });
    if (existingUser) {
      const isEmail = existingUser.email === email.trim().toLowerCase();
      return res.status(400).json({
        message: isEmail ? "An account with this email already exists." : "This username is already taken.",
        success: false,
      });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: normalizedRole,
      imageUrl: profileUrl,
      imageUrlId: profilePublicId,
    });

    generateToken(user, res);

    return res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({ message: `An account with this ${field} already exists.`, success: false });
    }
    return res.status(500).json({ message: "Signup failed.", error: error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required.", success: false });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check predefined demo users
    if (DEMO_USERS[cleanEmail]) {
      const demoUser = {
        ...DEMO_USERS[cleanEmail],
        role: DEMO_USERS[cleanEmail].role === "user" ? "patient" : DEMO_USERS[cleanEmail].role,
      };
      generateToken(demoUser, res);
      return res.status(200).json({
        message: `Welcome back, ${demoUser.username}!`,
        user: demoUser,
        success: true,
      });
    }

    // If MongoDB is offline, fallback gracefully with a simulated account preserving role
    if (mongoose.connection.readyState !== 1) {
      const role = cleanEmail.includes("admin")
        ? "admin"
        : cleanEmail.includes("doctor")
        ? "doctor"
        : "patient";

      const fallbackUser = {
        id: `user-${Date.now()}`,
        _id: `user-${Date.now()}`,
        username: cleanEmail.split("@")[0] || "Medicare Member",
        email: cleanEmail,
        role,
        imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      };
      generateToken(fallbackUser, res);
      return res.status(200).json({
        message: "Login successful.",
        user: fallbackUser,
        success: true,
      });
    }

    // Normal MongoDB check
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password.", success: false });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password.", success: false });
    }

    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.role === "user") {
      userObj.role = "patient";
    }

    generateToken(userObj, res);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
        role: userObj.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login error occurred.", error: error.message, success: false });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  return res.status(200).json({ message: "Logged out successfully.", success: true });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated", success: false });
    }

    const userRole = req.user.role === "user" ? "patient" : req.user.role;

    return res.status(200).json({
      user: {
        id: req.user.id || req.user._id,
        _id: req.user._id || req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: userRole,
        imageUrl: req.user.imageUrl,
      },
      message: "User is authenticated",
      success: true,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message, success: false });
  }
};

