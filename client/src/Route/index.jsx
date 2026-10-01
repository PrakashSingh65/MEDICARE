import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Page/Home";
import Login from "../Page/Login";
import Signup from "../Page/Signup";
import Contact from "../Page/Contact";

import AdminDashboard from "../Page/Admin/AdminDashboard";
import DoctorManagement from "../Page/Admin/DoctorManagement";
import PatientManagement from "../Page/Admin/PatientManagement";
import AppointmentManagement from "../Page/Admin/AppointmentManagement";
import PaymentManagement from "../Page/Admin/PaymentManagement";
import ContentManagement from "../Page/Admin/ContentManagement";
import SystemManagement from "../Page/Admin/SystemManagement";
import MedicineList from "../Page/Admin/MedicineList";
import RevenueGrowth from "../Page/Admin/RevenueGrowth";

import DoctorDashboard from "../Page/Doctor/DoctorDashboard";
import DoctorProfile from "../Page/Doctor/DoctorProfile";
import DoctorSchedule from "../Page/Doctor/DoctorSchedule";
import DoctorAppointments from "../Page/Doctor/DoctorAppointments";
import DoctorPatients from "../Page/Doctor/DoctorPatients";
import DoctorConsultation from "../Page/Doctor/DoctorConsultation";
import DoctorPrescription from "../Page/Doctor/DoctorPrescription";
import DoctorReports from "../Page/Doctor/DoctorReports";

import PatientDashboard from "../Page/Patient/PatientDashboard";
import PatientAppointments from "../Page/Patient/PatientAppointments";
import PatientPrescriptions from "../Page/Patient/PatientPrescriptions";
import PatientMedicalHistory from "../Page/Patient/PatientMedicalHistory";

import ProtectedRoute from "../components/ProtectedRoute";

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

      {
        path: "patient",
        element: (
          <ProtectedRoute allowedRoles={["patient", "admin"]}>
            <PatientDashboard />
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
    ],
  },
]);