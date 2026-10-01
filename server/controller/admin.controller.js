export {
  getDashboardStats,
} from "./admin/dashboard.controller.js";

export {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  reviewDoctorRegistration,
  verifyDoctorQualifications,
  updateDoctorStatus,
  updateDoctorInfo,
  deleteDoctor,
} from "./admin/doctorManagement.controller.js";

export {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  updatePatientStatus,
  getPatientActivity,
} from "./admin/patientManagement.controller.js";

export {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  cancelAppointment,
  resolveAppointmentIssue,
} from "./admin/appointmentManagement.controller.js";

export {
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
} from "./admin/paymentManagement.controller.js";

export {
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
} from "./admin/contentManagement.controller.js";

export {
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
} from "./admin/systemManagement.controller.js";
