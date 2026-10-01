import express from "express";
import { handleUpload } from "../../middleware/handleUpload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  registerPatient,
  loginPatient,
  logoutPatient,
  sendVerificationCode,
  verifyEmailOrPhone,
  forgotPassword,
  resetPassword,
  getPatientProfile,
  updatePatientProfile,
} from "../../controller/patient/patientAuthProfile.controller.js";

const router = express.Router();

router.post("/auth/register", handleUpload, registerPatient);
router.post("/auth/login", loginPatient);
router.post("/auth/logout", logoutPatient);
router.post("/auth/send-verification", sendVerificationCode);
router.post("/auth/verify-contact", verifyEmailOrPhone);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);

router
  .route("/profile")
  .get(authMiddleware, authorizeRoles("patient", "user", "admin"), getPatientProfile)
  .put(authMiddleware, authorizeRoles("patient", "user", "admin"), handleUpload, updatePatientProfile);

export default router;
