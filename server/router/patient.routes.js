import express from "express";
import upload from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  registerPatient,
  loginPatient,
  logoutPatient,
  sendVerificationCode,
  verifyEmailOrPhone,
  forgotPassword,
  resetPassword,
  getPatientProfile,
  updatePatientProfile,
  searchDoctors,
  getDoctorPublicProfile,
  getDoctorAvailableSlots,
  bookAppointment,
  reschedulePatientAppointment,
  cancelPatientAppointment,
  getPatientAppointmentHistory,
  getPatientUpcomingAppointments,
  getAppointmentReminders,
  createAppointmentReminder,
  getMedicalHistoryAndRecords,
  uploadPatientMedicalDocument,
  getPatientLabReports,
  downloadMedicalDocument,
  trackPreviousDiagnoses,
  joinOrStartVideoConsultation,
  joinOrStartAudioConsultation,
  getPatientConsultationChat,
  sendPatientConsultationChat,
  shareConsultationDocument,
  getPatientConsultationHistory,
  getPatientPrescriptions,
  getPatientPrescriptionDetail,
  downloadPatientPrescriptionPdf,
  payConsultationFee,
  getPatientPaymentHistory,
  getPaymentInvoiceReceipt,
  getPatientRefundStatus,
  requestPaymentRefund,
  getPatientNotifications,
  getNotificationsByCategory,
  markPatientNotificationRead,
} from "../controller/patient.controller.js";

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

router.post("/auth/register", handleUpload, registerPatient);
router.post("/auth/login", loginPatient);
router.post("/auth/logout", logoutPatient);
router.post("/auth/send-verification", sendVerificationCode);
router.post("/auth/verify-contact", verifyEmailOrPhone);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);

router.get("/doctors", searchDoctors);
router.get("/doctors/:doctorId", getDoctorPublicProfile);
router.get("/doctors/:doctorId/slots", getDoctorAvailableSlots);

router.use(authMiddleware, authorizeRoles("patient", "user", "admin"));

router.route("/profile").get(getPatientProfile).put(handleUpload, updatePatientProfile);

router.post("/appointments", bookAppointment);
router.get("/appointments/history", getPatientAppointmentHistory);
router.get("/appointments/upcoming", getPatientUpcomingAppointments);
router.get("/appointments/reminders", getAppointmentReminders);
router.post("/appointments/:id/reminders", createAppointmentReminder);
router.patch("/appointments/:id/reschedule", reschedulePatientAppointment);
router.patch("/appointments/:id/cancel", cancelPatientAppointment);

router.get("/medical-records", getMedicalHistoryAndRecords);
router.post("/medical-records/reports", handleUpload, uploadPatientMedicalDocument);
router.get("/medical-records/prescriptions", getPatientPrescriptions);
router.get("/medical-records/lab-reports", getPatientLabReports);
router.get("/medical-records/reports/:id/download", downloadMedicalDocument);
router.get("/medical-records/diagnoses", trackPreviousDiagnoses);

router.get("/consultations/history", getPatientConsultationHistory);
router.post("/consultations/:id/video", joinOrStartVideoConsultation);
router.post("/consultations/:id/audio", joinOrStartAudioConsultation);
router
  .route("/consultations/:id/chat")
  .get(getPatientConsultationChat)
  .post(sendPatientConsultationChat);
router.post("/consultations/:id/share-file", handleUpload, shareConsultationDocument);

router.get("/prescriptions", getPatientPrescriptions);
router.get("/prescriptions/:id", getPatientPrescriptionDetail);
router.get("/prescriptions/:id/pdf", downloadPatientPrescriptionPdf);

router.post("/payments/pay", payConsultationFee);
router.get("/payments/history", getPatientPaymentHistory);
router.get("/payments/refunds", getPatientRefundStatus);
router.get("/payments/:id/invoice", getPaymentInvoiceReceipt);
router.post("/payments/:id/request-refund", requestPaymentRefund);

router.get("/notifications", getPatientNotifications);
router.get(
  "/notifications/appointment-reminders",
  getNotificationsByCategory(["appointment", "appointment_reminder"])
);
router.get(
  "/notifications/prescriptions",
  getNotificationsByCategory(["prescription"])
);
router.get("/notifications/payments", getNotificationsByCategory(["payment"]));
router.get(
  "/notifications/doctor-messages",
  getNotificationsByCategory(["doctor_message"])
);
router.patch("/notifications/:id/read", markPatientNotificationRead);

export default router;
