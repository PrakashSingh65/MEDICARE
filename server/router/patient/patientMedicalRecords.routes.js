import express from "express";
import { handleUpload } from "../../middleware/handleUpload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  getMedicalHistoryAndRecords,
  uploadPatientMedicalDocument,
  getPatientLabReports,
  downloadMedicalDocument,
  trackPreviousDiagnoses,
} from "../../controller/patient/patientMedicalRecords.controller.js";
import { getPatientPrescriptions } from "../../controller/patient/patientPrescriptions.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("patient", "user", "admin"));

router.get("/medical-records", getMedicalHistoryAndRecords);
router.post("/medical-records/reports", handleUpload, uploadPatientMedicalDocument);
router.get("/medical-records/prescriptions", getPatientPrescriptions);
router.get("/medical-records/lab-reports", getPatientLabReports);
router.get("/medical-records/reports/:id/download", downloadMedicalDocument);
router.get("/medical-records/diagnoses", trackPreviousDiagnoses);

export default router;
