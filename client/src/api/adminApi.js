import { axiosClient } from "./axiosClient";

// Dashboard
export const getAdminDashboardStats = async () => {
  const res = await axiosClient.get("/api/v1/admin/dashboard");
  return res.data;
};

// Doctors
export const getAdminDoctors = async (params = {}) => {
  const res = await axiosClient.get("/api/v1/admin/doctors", { params });
  return res.data;
};

export const getAdminDoctorById = async (id) => {
  const res = await axiosClient.get(`/api/v1/admin/doctors/${id}`);
  return res.data;
};

export const createAdminDoctor = async (doctorData) => {
  const res = await axiosClient.post("/api/v1/admin/doctors", doctorData);
  return res.data;
};

export const updateAdminDoctor = async (id, doctorData) => {
  const res = await axiosClient.put(`/api/v1/admin/doctors/${id}`, doctorData);
  return res.data;
};

export const reviewDoctorRegistration = async (id, status, rejectionReason = "") => {
  const res = await axiosClient.patch(`/api/v1/admin/doctors/${id}/registration`, {
    status,
    rejectionReason,
  });
  return res.data;
};

export const verifyDoctorQualifications = async (id, data = {}) => {
  const res = await axiosClient.patch(`/api/v1/admin/doctors/${id}/verify-qualifications`, data);
  return res.data;
};

export const updateDoctorStatus = async (id, status, suspensionReason = "") => {
  const res = await axiosClient.patch(`/api/v1/admin/doctors/${id}/status`, {
    accountStatus: status,
    suspensionReason,
  });
  return res.data;
};

export const deleteAdminDoctor = async (id) => {
  const res = await axiosClient.delete(`/api/v1/admin/doctors/${id}`);
  return res.data;
};

// Patients
export const getAdminPatients = async (params = {}) => {
  const res = await axiosClient.get("/api/v1/admin/patients", { params });
  return res.data;
};

export const getAdminPatientById = async (id) => {
  const res = await axiosClient.get(`/api/v1/admin/patients/${id}`);
  return res.data;
};

export const createAdminPatient = async (patientData) => {
  const res = await axiosClient.post("/api/v1/admin/patients", patientData);
  return res.data;
};

export const updateAdminPatient = async (id, patientData) => {
  const res = await axiosClient.put(`/api/v1/admin/patients/${id}`, patientData);
  return res.data;
};

export const updatePatientStatus = async (id, status, statusReason = "") => {
  const res = await axiosClient.patch(`/api/v1/admin/patients/${id}/status`, {
    accountStatus: status,
    statusReason,
  });
  return res.data;
};

export const getAdminPatientActivity = async (id) => {
  const res = await axiosClient.get(`/api/v1/admin/patients/${id}/activity`);
  return res.data;
};

// Appointments
export const getAdminAppointments = async (params = {}) => {
  const res = await axiosClient.get("/api/v1/admin/appointments", { params });
  return res.data;
};

export const createAdminAppointment = async (apptData) => {
  const res = await axiosClient.post("/api/v1/admin/appointments", apptData);
  return res.data;
};

export const cancelAdminAppointment = async (id, cancellationReason = "Cancelled by administrator") => {
  const res = await axiosClient.patch(`/api/v1/admin/appointments/${id}/cancel`, {
    cancellationReason,
  });
  return res.data;
};

export const resolveAdminAppointmentIssue = async (id, notes = "") => {
  const res = await axiosClient.patch(`/api/v1/admin/appointments/${id}/resolve-issue`, {
    notes,
  });
  return res.data;
};

// Payments & Financials
export const getAdminTransactions = async (params = {}) => {
  const res = await axiosClient.get("/api/v1/admin/payments/transactions", { params });
  return res.data;
};

export const getAdminRevenueAnalytics = async () => {
  const res = await axiosClient.get("/api/v1/admin/payments/revenue");
  return res.data;
};

export const getAdminRefunds = async () => {
  const res = await axiosClient.get("/api/v1/admin/payments/refunds");
  return res.data;
};

export const processAdminRefund = async (transactionId, refundReason = "") => {
  const res = await axiosClient.post(`/api/v1/admin/payments/transactions/${transactionId}/refund`, {
    refundReason,
  });
  return res.data;
};

export const getAdminFailedPayments = async () => {
  const res = await axiosClient.get("/api/v1/admin/payments/failed");
  return res.data;
};

export const resolveAdminFailedPayment = async (transactionId, status = "completed") => {
  const res = await axiosClient.patch(`/api/v1/admin/payments/transactions/${transactionId}/status`, {
    status,
  });
  return res.data;
};

export const getAdminDoctorPayouts = async () => {
  const res = await axiosClient.get("/api/v1/admin/payments/payouts");
  return res.data;
};

export const updateAdminPayoutStatus = async (id, status = "paid") => {
  const res = await axiosClient.patch(`/api/v1/admin/payments/payouts/${id}/status`, {
    status,
  });
  return res.data;
};

// Content
export const getAdminSpecialties = async () => {
  const res = await axiosClient.get("/api/v1/admin/content/specialties");
  return res.data;
};

export const getAdminDepartments = async () => {
  const res = await axiosClient.get("/api/v1/admin/content/departments");
  return res.data;
};

export const getAdminFaqs = async () => {
  const res = await axiosClient.get("/api/v1/admin/content/faqs");
  return res.data;
};

export const getAdminArticles = async () => {
  const res = await axiosClient.get("/api/v1/admin/content/articles");
  return res.data;
};

export const getAdminAnnouncements = async () => {
  const res = await axiosClient.get("/api/v1/admin/content/announcements");
  return res.data;
};

// System & Roles
export const getAdminSystemSettings = async () => {
  const res = await axiosClient.get("/api/v1/admin/system/settings");
  return res.data;
};

export const updateAdminSystemSettings = async (settings) => {
  const res = await axiosClient.put("/api/v1/admin/system/settings", settings);
  return res.data;
};

export const getAdminAuditLogs = async (params = {}) => {
  const res = await axiosClient.get("/api/v1/admin/system/audit-logs", { params });
  return res.data;
};

export const getAdminRolePermissions = async () => {
  const res = await axiosClient.get("/api/v1/admin/system/roles");
  return res.data;
};
