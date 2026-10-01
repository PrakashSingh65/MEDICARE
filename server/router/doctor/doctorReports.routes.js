import express from "express";
import { handleUpload } from "../../middleware/handleUpload.middleware.js";
import {
  uploadMedicalReport,
  getPatientReports,
  addReportInterpretation,
} from "../../controller/doctor/doctorReports.controller.js";

const router = express.Router();

router.route("/").get(getPatientReports).post(handleUpload, uploadMedicalReport);
router.patch("/:id/interpretation", addReportInterpretation);

export default router;
