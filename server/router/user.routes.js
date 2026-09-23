import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controller/user.controller.js";
import upload  from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/checkAuth").get(authMiddleware, checkAuth);
router.route("/me").get(authMiddleware, checkAuth);
router.route("/verify").get(authMiddleware, checkAuth);

// Admin-only verification route
router.route("/admin-check").get(authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    message: "Admin authorization verified successfully",
    user: req.user,
    success: true,
  });
});

export default router;
