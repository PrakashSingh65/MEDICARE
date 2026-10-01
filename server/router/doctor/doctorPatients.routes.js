import express from "express";
import {
  getDoctorPatients,
  getPatientMedicalRecord,
  updatePatientClinicalInfo,
} from "../../controller/doctor/doctorPatients.controller.js";

const router = express.Router();

router.get("/", getDoctorPatients);
router.get("/:patientId/medical-record", getPatientMedicalRecord);
router.put("/:patientId/clinical-info", updatePatientClinicalInfo);

export default router;
