import express from "express";
import {
  getTodayAppointments,
  getUpcomingAppointments,
  respondToAppointment,
  rescheduleAppointment,
  getAppointmentHistory,
  getAppointmentPatientDetails,
} from "../../controller/doctor/doctorAppointments.controller.js";

const router = express.Router();

router.get("/", getAppointmentHistory);
router.get("/today", getTodayAppointments);
router.get("/upcoming", getUpcomingAppointments);
router.get("/history", getAppointmentHistory);
router.patch("/:id/respond", respondToAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);
router.get("/:id/patient-details", getAppointmentPatientDetails);

export default router;
