import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import doctorDashboardRoutes from "./doctor/doctorDashboard.routes.js";
import doctorProfileRoutes from "./doctor/doctorProfile.routes.js";
import doctorScheduleRoutes from "./doctor/doctorSchedule.routes.js";
import doctorAppointmentsRoutes from "./doctor/doctorAppointments.routes.js";
import doctorPatientsRoutes from "./doctor/doctorPatients.routes.js";
import doctorConsultationRoutes from "./doctor/doctorConsultation.routes.js";
import doctorPrescriptionRoutes from "./doctor/doctorPrescription.routes.js";
import doctorReportsRoutes from "./doctor/doctorReports.routes.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("doctor", "admin"));

router.use("/", doctorDashboardRoutes);
router.use("/profile", doctorProfileRoutes);
router.use("/schedule", doctorScheduleRoutes);
router.use("/appointments", doctorAppointmentsRoutes);
router.use("/patients", doctorPatientsRoutes);
router.use("/consultations", doctorConsultationRoutes);
router.use("/prescriptions", doctorPrescriptionRoutes);
router.use("/reports", doctorReportsRoutes);

export default router;
