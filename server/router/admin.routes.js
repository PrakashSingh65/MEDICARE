import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  getDashboardStats,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  reviewDoctorRegistration,
  verifyDoctorQualifications,
  updateDoctorStatus,
  updateDoctorInfo,
  deleteDoctor,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  updatePatientStatus,
  getPatientActivity,
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  cancelAppointment,
  resolveAppointmentIssue,
  getTransactions,
  createTransaction,
  getRevenueAnalytics,
  getRefunds,
  processRefund,
  getFailedPayments,
  updateFailedPaymentStatus,
  getDoctorPayouts,
  createDoctorPayout,
  updateDoctorPayoutStatus,
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getHealthArticles,
  createHealthArticle,
  updateHealthArticle,
  deleteHealthArticle,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getRoles,
  upsertRolePermission,
  updateRoleById,
  deleteRoleById,
  updateUserRoleAndPermissions,
  getAuditLogs,
  getNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
  getSystemSettings,
  upsertSystemSettings,
  getSystemReports,
} from "../controller/admin.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin", "sub_admin"));

router.get("/dashboard", getDashboardStats);

router.route("/doctors").get(getAllDoctors).post(createDoctor);
router
  .route("/doctors/:id")
  .get(getDoctorById)
  .put(updateDoctorInfo)
  .delete(deleteDoctor);
router.patch("/doctors/:id/registration", reviewDoctorRegistration);
router.patch("/doctors/:id/verify-qualifications", verifyDoctorQualifications);
router.patch("/doctors/:id/status", updateDoctorStatus);

router.route("/patients").get(getAllPatients).post(createPatient);
router.route("/patients/:id").get(getPatientById).put(updatePatient);
router.patch("/patients/:id/status", updatePatientStatus);
router.get("/patients/:id/activity", getPatientActivity);

router.route("/appointments").get(getAllAppointments).post(createAppointment);
router.get("/appointments/:id", getAppointmentById);
router.patch("/appointments/:id/cancel", cancelAppointment);
router.patch("/appointments/:id/resolve-issue", resolveAppointmentIssue);

router.route("/payments/transactions").get(getTransactions).post(createTransaction);
router.get("/payments/revenue", getRevenueAnalytics);
router.get("/payments/refunds", getRefunds);
router.post("/payments/transactions/:id/refund", processRefund);
router.get("/payments/failed", getFailedPayments);
router.patch("/payments/transactions/:id/status", updateFailedPaymentStatus);
router.route("/payments/payouts").get(getDoctorPayouts).post(createDoctorPayout);
router.patch("/payments/payouts/:id/status", updateDoctorPayoutStatus);

router.route("/content/specialties").get(getSpecialties).post(createSpecialty);
router
  .route("/content/specialties/:id")
  .put(updateSpecialty)
  .delete(deleteSpecialty);

router.route("/content/departments").get(getDepartments).post(createDepartment);
router
  .route("/content/departments/:id")
  .put(updateDepartment)
  .delete(deleteDepartment);

router.route("/content/faqs").get(getFaqs).post(createFaq);
router.route("/content/faqs/:id").put(updateFaq).delete(deleteFaq);

router.route("/content/articles").get(getHealthArticles).post(createHealthArticle);
router
  .route("/content/articles/:id")
  .put(updateHealthArticle)
  .delete(deleteHealthArticle);

router
  .route("/content/announcements")
  .get(getAnnouncements)
  .post(createAnnouncement);
router
  .route("/content/announcements/:id")
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

router.route("/system/roles").get(getRoles).post(upsertRolePermission);
router.route("/system/roles/:id").put(updateRoleById).delete(deleteRoleById);
router.patch("/system/users/:userId/role", updateUserRoleAndPermissions);
router.get("/system/audit-logs", getAuditLogs);
router
  .route("/system/notifications")
  .get(getNotifications)
  .post(createNotification);
router.patch("/system/notifications/:id/read", markNotificationRead);
router.delete("/system/notifications/:id", deleteNotification);
router
  .route("/system/settings")
  .get(getSystemSettings)
  .put(upsertSystemSettings);
router.get("/system/reports", getSystemReports);

export default router;
