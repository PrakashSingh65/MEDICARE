import express from "express";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  reviewDoctorRegistration,
  verifyDoctorQualifications,
  updateDoctorStatus,
  updateDoctorInfo,
  deleteDoctor,
} from "../../controller/admin/doctorManagement.controller.js";

const router = express.Router();

router.route("/").get(getAllDoctors).post(createDoctor);
router
  .route("/:id")
  .get(getDoctorById)
  .put(updateDoctorInfo)
  .delete(deleteDoctor);
router.patch("/:id/registration", reviewDoctorRegistration);
router.patch("/:id/verify-qualifications", verifyDoctorQualifications);
router.patch("/:id/status", updateDoctorStatus);

export default router;
