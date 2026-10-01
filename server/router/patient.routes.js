import express from "express";
import patientAuthProfileRoutes from "./patient/patientAuthProfile.routes.js";
import patientAppointmentsRoutes from "./patient/patientAppointments.routes.js";
import patientMedicalRecordsRoutes from "./patient/patientMedicalRecords.routes.js";
import patientConsultationRoutes from "./patient/patientConsultation.routes.js";
import patientPrescriptionsRoutes from "./patient/patientPrescriptions.routes.js";
import patientPaymentsRoutes from "./patient/patientPayments.routes.js";
import patientNotificationsRoutes from "./patient/patientNotifications.routes.js";

const router = express.Router();

router.use("/", patientAuthProfileRoutes);
router.use("/", patientAppointmentsRoutes);
router.use("/", patientMedicalRecordsRoutes);
router.use("/", patientConsultationRoutes);
router.use("/", patientPrescriptionsRoutes);
router.use("/", patientPaymentsRoutes);
router.use("/", patientNotificationsRoutes);

export default router;
