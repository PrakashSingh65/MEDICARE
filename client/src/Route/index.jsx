import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Page/Home";
import ProtectedRoute from "../components/ProtectedRoute";

// Public pages - lazy loaded (secondary routes)
const Login = lazy(() => import("../Page/Login"));
const Signup = lazy(() => import("../Page/Signup"));
const Contact = lazy(() => import("../Page/Contact"));
const ForgotPassword = lazy(() => import("../Page/ForgotPassword"));
const VerifyContact = lazy(() => import("../Page/VerifyContact"));

// Admin pages - lazy loaded
const AdminDashboard = lazy(() => import("../Page/Admin/AdminDashboard"));
const DoctorManagement = lazy(() => import("../Page/Admin/DoctorManagement"));
const PatientManagement = lazy(() => import("../Page/Admin/PatientManagement"));
const AppointmentManagement = lazy(() => import("../Page/Admin/AppointmentManagement"));
const PaymentManagement = lazy(() => import("../Page/Admin/PaymentManagement"));
const ContentManagement = lazy(() => import("../Page/Admin/ContentManagement"));
const SystemManagement = lazy(() => import("../Page/Admin/SystemManagement"));
const MedicineList = lazy(() => import("../Page/Admin/MedicineList"));
const RevenueGrowth = lazy(() => import("../Page/Admin/RevenueGrowth"));

// Doctor pages - lazy loaded
const DoctorDashboard = lazy(() => import("../Page/Doctor/DoctorDashboard"));
const DoctorProfile = lazy(() => import("../Page/Doctor/DoctorProfile"));
const DoctorSchedule = lazy(() => import("../Page/Doctor/DoctorSchedule"));
const DoctorAppointments = lazy(() => import("../Page/Doctor/DoctorAppointments"));
const DoctorPatients = lazy(() => import("../Page/Doctor/DoctorPatients"));
const DoctorConsultation = lazy(() => import("../Page/Doctor/DoctorConsultation"));
const DoctorPrescription = lazy(() => import("../Page/Doctor/DoctorPrescription"));
const DoctorReports = lazy(() => import("../Page/Doctor/DoctorReports"));

// Patient pages - lazy loaded
const PatientDashboard = lazy(() => import("../Page/Patient/PatientDashboard"));
const PatientProfile = lazy(() => import("../Page/Patient/PatientProfile"));
const PatientAppointments = lazy(() => import("../Page/Patient/PatientAppointments"));
const PatientPrescriptions = lazy(() => import("../Page/Patient/PatientPrescriptions"));
const PatientMedicalHistory = lazy(() => import("../Page/Patient/PatientMedicalHistory"));
const PatientConsultation = lazy(() => import("../Page/Patient/PatientConsultation"));
const PatientPayments = lazy(() => import("../Page/Patient/PatientPayments"));
const PatientNotifications = lazy(() => import("../Page/Patient/PatientNotifications"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify",
        element: <VerifyContact />,
      },

      // Admin routes
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/doctors",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <DoctorManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/patients",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <PatientManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <PatientManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/appointments",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppointmentManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/payments",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <PaymentManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/content",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ContentManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/system",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <SystemManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/medicines",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <MedicineList />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/analytics",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <RevenueGrowth />
          </ProtectedRoute>
        ),
      },

      // Doctor routes
      {
        path: "doctor",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/profile",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/schedule",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorSchedule />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/appointments",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorAppointments />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/patients",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorPatients />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/consultation",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorConsultation />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/prescriptions",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorPrescription />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor/reports",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorReports />
          </ProtectedRoute>
        ),
      },

      // Patient routes
      {
        path: "patient",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/profile",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/appointments",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientAppointments />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/prescriptions",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientPrescriptions />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/history",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientMedicalHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/records",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientMedicalHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/consultation",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientConsultation />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/payments",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientPayments />
          </ProtectedRoute>
        ),
      },
      {
        path: "patient/notifications",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientNotifications />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
