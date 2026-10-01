import express from "express";
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  updatePatientStatus,
  getPatientActivity,
} from "../../controller/admin/patientManagement.controller.js";

const router = express.Router();

router.route("/").get(getAllPatients).post(createPatient);
router.route("/:id").get(getPatientById).put(updatePatient);
router.patch("/:id/status", updatePatientStatus);
router.get("/:id/activity", getPatientActivity);

export default router;
