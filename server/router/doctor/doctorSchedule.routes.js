import express from "express";
import {
  getSchedule,
  updateWorkingSchedule,
  createAppointmentSlots,
  blockUnavailableDate,
  manageVacation,
} from "../../controller/doctor/doctorSchedule.controller.js";

const router = express.Router();

router.get("/", getSchedule);
router.put("/", updateWorkingSchedule);
router.put("/working-hours", updateWorkingSchedule);
router.post("/slots", createAppointmentSlots);
router.post("/block-date", blockUnavailableDate);
router.route("/vacations").post(manageVacation).put(manageVacation);

export default router;
