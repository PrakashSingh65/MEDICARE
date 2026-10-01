import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  getPatientNotifications,
  getNotificationsByCategory,
  markPatientNotificationRead,
} from "../../controller/patient/patientNotifications.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("patient", "user", "admin"));

router.get("/notifications", getPatientNotifications);
router.get(
  "/notifications/appointment-reminders",
  getNotificationsByCategory(["appointment", "appointment_reminder"])
);
router.get(
  "/notifications/prescriptions",
  getNotificationsByCategory(["prescription"])
);
router.get("/notifications/payments", getNotificationsByCategory(["payment"]));
router.get(
  "/notifications/doctor-messages",
  getNotificationsByCategory(["doctor_message"])
);
router.patch("/notifications/:id/read", markPatientNotificationRead);

export default router;
