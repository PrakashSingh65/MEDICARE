import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Page/Home";
import Login from "../Page/Login";
import Signup from "../Page/Signup";
import Contact from "../Page/Contact";

// Admin Panel Pages
import AdminDashboard from "../Page/Admin/AdminDashboard";
import Doctorlist from "../Page/Admin/Doctorlist";
import UsersList from "../Page/Admin/UsersList";
import MedicineList from "../Page/Admin/MedicineList";
import RevenueGrowth from "../Page/Admin/RevenueGrowth";

// Doctor Panel Pages
import DoctorDashboard from "../Page/Doctor/DoctorDashboard";
import DoctorAppointments from "../Page/Doctor/DoctorAppointments";
import DoctorPatients from "../Page/Doctor/DoctorPatients";

// Patient Panel Pages
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

      // Admin Panel (Protected: Admin Only)
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
            <Doctorlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/patients",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersList />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersList />
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

      // Doctor Panel (Protected: Doctor & Admin)
      {
        path: "doctor",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <DoctorDashboard />
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

      // Patient Panel (Protected: Patient & Admin)
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