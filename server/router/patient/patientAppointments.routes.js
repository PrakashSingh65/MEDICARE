import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  searchDoctors,
  getDoctorPublicProfile,
  getDoctorAvailableSlots,
  bookAppointment,
  reschedulePatientAppointment,
  cancelPatientAppointment,
  getPatientAppointmentHistory,
  getPatientUpcomingAppointments,
  getAppointmentReminders,
  createAppointmentReminder,
} from "../../controller/patient/patientAppointments.controller.js";

const router = express.Router();

router.get("/doctors", searchDoctors);
router.get("/doctors/:doctorId", getDoctorPublicProfile);
router.get("/doctors/:doctorId/slots", getDoctorAvailableSlots);

router.post("/appointments", authMiddleware, authorizeRoles("patient", "user", "admin"), bookAppointment);
router.get("/appointments/history", authMiddleware, authorizeRoles("patient", "user", "admin"), getPatientAppointmentHistory);
router.get("/appointments/upcoming", authMiddleware, authorizeRoles("patient", "user", "admin"), getPatientUpcomingAppointments);
router.get("/appointments/reminders", authMiddleware, authorizeRoles("patient", "user", "admin"), getAppointmentReminders);
router.post("/appointments/:id/reminders", authMiddleware, authorizeRoles("patient", "user", "admin"), createAppointmentReminder);
router.patch("/appointments/:id/reschedule", authMiddleware, authorizeRoles("patient", "user", "admin"), reschedulePatientAppointment);
router.patch("/appointments/:id/cancel", authMiddleware, authorizeRoles("patient", "user", "admin"), cancelPatientAppointment);

export default router;
