import { axiosClient } from "./axiosClient";

// Dashboard
export const getDoctorDashboard = async () => {
  const res = await axiosClient.get("/api/v1/doctor/dashboard");
  return res.data;
};

// Profile
export const getDoctorProfile = async () => {
  const res = await axiosClient.get("/api/v1/doctor/profile");
  return res.data;
};

export const updateDoctorProfile = async (profileData) => {
  const res = await axiosClient.put("/api/v1/doctor/profile", profileData);
  return res.data;
};

// Schedule
export const getDoctorSchedule = async () => {
  const res = await axiosClient.get("/api/v1/doctor/schedule");
  return res.data;
};

export const updateDoctorSchedule = async (scheduleData) => {
  const res = await axiosClient.put("/api/v1/doctor/schedule", scheduleData);
  return res.data;
};

// Appointments
export const getDoctorTodayAppointments = async () => {
  const res = await axiosClient.get("/api/v1/doctor/appointments/today");
  return res.data;
};

export const getDoctorUpcomingAppointments = async () => {
  const res = await axiosClient.get("/api/v1/doctor/appointments/upcoming");
  return res.data;
};

export const getDoctorAppointmentHistory = async () => {
  const res = await axiosClient.get("/api/v1/doctor/appointments/history");
  return res.data;
};

export const respondToAppointment = async (id, action, reason = "") => {
  const res = await axiosClient.patch(`/api/v1/doctor/appointments/${id}/respond`, {
    action,
    reason,
  });
  return res.data;
};

export const rescheduleDoctorAppointment = async (id, newDate, newTimeSlot, reason = "") => {
  const res = await axiosClient.patch(`/api/v1/doctor/appointments/${id}/reschedule`, {
    newDate,
    newTimeSlot,
    reason,
  });
  return res.data;
};

export const getDoctorAppointmentPatientDetails = async (id) => {
  const res = await axiosClient.get(`/api/v1/doctor/appointments/${id}/patient-details`);
  return res.data;
};

// Patients
export const getDoctorPatients = async () => {
  const res = await axiosClient.get("/api/v1/doctor/patients");
  return res.data;
};

// Consultations
export const getDoctorConsultations = async () => {
  const res = await axiosClient.get("/api/v1/doctor/consultations");
  return res.data;
};

// Prescriptions
export const getDoctorPrescriptions = async () => {
  const res = await axiosClient.get("/api/v1/doctor/prescriptions");
  return res.data;
};

export const createDoctorPrescription = async (prescriptionData) => {
  const res = await axiosClient.post("/api/v1/doctor/prescriptions", prescriptionData);
  return res.data;
};

// Reports
export const getDoctorReports = async () => {
  const res = await axiosClient.get("/api/v1/doctor/reports");
  return res.data;
};

export const uploadDoctorReport = async (reportData) => {
  const res = await axiosClient.post("/api/v1/doctor/reports", reportData);
  return res.data;
};
