import express from "express";
import { getDoctorDashboard } from "../../controller/doctor/doctorDashboard.controller.js";

const router = express.Router();

router.get("/dashboard", getDoctorDashboard);
router.get("/", getDoctorDashboard);

export default router;
