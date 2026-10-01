import { axiosClient } from "./axiosClient";

// Profile
export const getPatientProfile = async () => {
  const res = await axiosClient.get("/api/v1/patient/profile");
  return res.data;
};

export const updatePatientProfile = async (profileData) => {
  const res = await axiosClient.put("/api/v1/patient/profile", profileData);
  return res.data;
};

// Doctors search & directory
export const searchAvailableDoctors = async (params = {}) => {
  const res = await axiosClient.get("/api/v1/patient/doctors", { params });
  return res.data;
};

export const getDoctorPublicProfile = async (doctorId) => {
  const res = await axiosClient.get(`/api/v1/patient/doctors/${doctorId}`);
  return res.data;
};

export const getDoctorAvailableSlots = async (doctorId, date) => {
  const res = await axiosClient.get(`/api/v1/patient/doctors/${doctorId}/slots`, {
    params: { date },
  });
  return res.data;
};

// Appointments
export const bookPatientAppointment = async (bookingData) => {
  const res = await axiosClient.post("/api/v1/patient/appointments", bookingData);
  return res.data;
};

export const getPatientUpcomingAppointments = async () => {
  const res = await axiosClient.get("/api/v1/patient/appointments/upcoming");
  return res.data;
};

export const getPatientAppointmentHistory = async () => {
  const res = await axiosClient.get("/api/v1/patient/appointments/history");
  return res.data;
};

export const reschedulePatientAppointment = async (id, newDate, newTimeSlot, reason = "") => {
  const res = await axiosClient.patch(`/api/v1/patient/appointments/${id}/reschedule`, {
    newDate,
    newTimeSlot,
    reason,
  });
  return res.data;
};

export const cancelPatientAppointment = async (id, cancellationReason = "Cancelled by patient") => {
  const res = await axiosClient.patch(`/api/v1/patient/appointments/${id}/cancel`, {
    cancellationReason,
  });
  return res.data;
};

// Records
export const getPatientRecords = async () => {
  const res = await axiosClient.get("/api/v1/patient/records");
  return res.data;
};

export const uploadPatientRecord = async (recordData) => {
  const res = await axiosClient.post("/api/v1/patient/records/upload", recordData);
  return res.data;
};

// Prescriptions
export const getPatientPrescriptions = async () => {
  const res = await axiosClient.get("/api/v1/patient/prescriptions");
  return res.data;
};

// Consultations
export const getPatientConsultations = async () => {
  const res = await axiosClient.get("/api/v1/patient/consultations");
  return res.data;
};

export const sendConsultationMessage = async (consultationId, message) => {
  const res = await axiosClient.post(`/api/v1/patient/consultations/${consultationId}/messages`, {
    message,
  });
  return res.data;
};

// Payments
export const getPatientPayments = async () => {
  const res = await axiosClient.get("/api/v1/patient/payments");
  return res.data;
};

export const checkoutPatientPayment = async (paymentData) => {
  const res = await axiosClient.post("/api/v1/patient/payments/checkout", paymentData);
  return res.data;
};

// Notifications
export const getPatientNotifications = async () => {
  const res = await axiosClient.get("/api/v1/patient/notifications");
  return res.data;
};

export const markPatientNotificationRead = async (id) => {
  const res = await axiosClient.patch(`/api/v1/patient/notifications/${id}/read`);
  return res.data;
};

export const markAllPatientNotificationsRead = async () => {
  const res = await axiosClient.patch("/api/v1/patient/notifications/read-all");
  return res.data;
};
