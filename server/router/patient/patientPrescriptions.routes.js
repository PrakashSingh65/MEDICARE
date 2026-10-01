import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  getPatientPrescriptions,
  getPatientPrescriptionDetail,
  downloadPatientPrescriptionPdf,
} from "../../controller/patient/patientPrescriptions.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("patient", "user", "admin"));

router.get("/prescriptions", getPatientPrescriptions);
router.get("/prescriptions/:id", getPatientPrescriptionDetail);
router.get("/prescriptions/:id/pdf", downloadPatientPrescriptionPdf);

export default router;
