import express from "express";
import { handleUpload } from "../../middleware/handleUpload.middleware.js";
import {
  getDoctorProfile,
  updateDoctorProfile,
  getVerificationStatus,
} from "../../controller/doctor/doctorProfile.controller.js";

const router = express.Router();

router.route("/").get(getDoctorProfile).put(handleUpload, updateDoctorProfile);
router.get("/verification-status", getVerificationStatus);

export default router;
