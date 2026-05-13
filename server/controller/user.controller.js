import User from "../model/user.model.js";
import { UploadImage } from "../utils/upload-image.js";
import { generateToken } from "../utils/generate-token.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(401)
        .json({ message: "User already exists", success: false });
    }

    const imageUrl = req.file;

    if (!imageUrl) {
      return res
        .status(401)
        .json({ message: "Please upload a profile image", success: false });
    }

    const profileImage = await UploadImage(imageUrl, "medicare-profile-images");

    const user = await User.create({
      username: username.trim(),
      email: email.trim(),
      password,
      role: role || "user",
      imageUrl: profileImage.secure_url,
      imageUrlId: profileImage.public_id,
    });

    generateToken(user._id, res);

    return res.status(201).json({
      message: "User created successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Signup failed.", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Login failed.", error: error.message });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully." });
};

export const checkAuth = async (req, res) => {
  try {
    res
      .status(200)
      .json(req.user, { message: "User is authenticated", success: true });
  } catch (error) {
    res.status(401).json({ message: error.message, success: false });
  }
};
