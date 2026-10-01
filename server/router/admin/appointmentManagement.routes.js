import express from "express";
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  cancelAppointment,
  resolveAppointmentIssue,
} from "../../controller/admin/appointmentManagement.controller.js";

const router = express.Router();

router.route("/").get(getAllAppointments).post(createAppointment);
router.get("/:id", getAppointmentById);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/resolve-issue", resolveAppointmentIssue);

export default router;
