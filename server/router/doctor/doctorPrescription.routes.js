import express from "express";
import {
  createPrescription,
  getPrescriptionHistory,
  getPrescriptionById,
  generatePrescriptionPdf,
} from "../../controller/doctor/doctorPrescription.controller.js";

const router = express.Router();

router.route("/").get(getPrescriptionHistory).post(createPrescription);
router.get("/:id", getPrescriptionById);
router.get("/:id/pdf", generatePrescriptionPdf);

export default router;
