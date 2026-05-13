import express from "express";
import {
  signup,
  login,
  logout,
  checkAuth,
} from "../controller/user.controller.js";
import upload  from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(upload.single("image"), signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/checkAuth").get(authMiddleware, checkAuth);

export default router;
