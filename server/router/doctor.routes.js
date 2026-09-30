import express from "express";
import upload from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  getDoctorDashboard,
  getDoctorProfile,
  updateDoctorProfile,
  getVerificationStatus,
  getSchedule,
  updateWorkingSchedule,
  createAppointmentSlots,
  blockUnavailableDate,
  manageVacation,
  getTodayAppointments,
  getUpcomingAppointments,
  respondToAppointment,
  rescheduleAppointment,
  getAppointmentHistory,
  getAppointmentPatientDetails,
  getDoctorPatients,
  getPatientMedicalRecord,
  updatePatientClinicalInfo,
  startVideoConsultation,
  endVideoConsultation,
  sendConsultationChatMessage,
  getConsultationChatMessages,
  updateConsultationDetails,
  getConsultationById,
  createPrescription,
  getPrescriptionHistory,
  getPrescriptionById,
  generatePrescriptionPdf,
  uploadMedicalReport,
  getPatientReports,
  addReportInterpretation,
} from "../controller/doctor.controller.js";

const router = express.Router();

const handleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "File upload failed",
        success: false,
      });
    }
    if (!req.file && Array.isArray(req.files) && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.use(authMiddleware, authorizeRoles("doctor", "admin"));

router.get("/dashboard", getDoctorDashboard);

router.route("/profile").get(getDoctorProfile).put(handleUpload, updateDoctorProfile);
router.get("/profile/verification-status", getVerificationStatus);

router.get("/schedule", getSchedule);
router.put("/schedule/working-hours", updateWorkingSchedule);
router.post("/schedule/slots", createAppointmentSlots);
router.post("/schedule/block-date", blockUnavailableDate);
router.route("/schedule/vacations").post(manageVacation).put(manageVacation);

router.get("/appointments/today", getTodayAppointments);
router.get("/appointments/upcoming", getUpcomingAppointments);
router.get("/appointments/history", getAppointmentHistory);
router.patch("/appointments/:id/respond", respondToAppointment);
router.patch("/appointments/:id/reschedule", rescheduleAppointment);
router.get("/appointments/:id/patient-details", getAppointmentPatientDetails);

router.get("/patients", getDoctorPatients);
router.get("/patients/:patientId/medical-record", getPatientMedicalRecord);
router.put("/patients/:patientId/clinical-info", updatePatientClinicalInfo);

router.post("/consultations/start-video", startVideoConsultation);
router.patch("/consultations/:id/end-video", endVideoConsultation);
router.get("/consultations/:id", getConsultationById);
router.put("/consultations/:id/notes", updateConsultationDetails);
router
  .route("/consultations/:id/chat")
  .get(getConsultationChatMessages)
  .post(sendConsultationChatMessage);

router.route("/prescriptions").get(getPrescriptionHistory).post(createPrescription);
router.get("/prescriptions/:id", getPrescriptionById);
router.get("/prescriptions/:id/pdf", generatePrescriptionPdf);

router.route("/reports").get(getPatientReports).post(handleUpload, uploadMedicalReport);
router.patch("/reports/:id/interpretation", addReportInterpretation);

export default router;
