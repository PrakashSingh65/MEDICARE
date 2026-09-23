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

      // Admin Panel
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin/doctors",
        element: <Doctorlist />,
      },
      {
        path: "admin/patients",
        element: <UsersList />,
      },
      {
        path: "admin/users",
        element: <UsersList />,
      },
      {
        path: "admin/medicines",
        element: <MedicineList />,
      },
      {
        path: "admin/analytics",
        element: <RevenueGrowth />,
      },

      // Doctor Panel
      {
        path: "doctor",
        element: <DoctorDashboard />,
      },
      {
        path: "doctor/appointments",
        element: <DoctorAppointments />,
      },
      {
        path: "doctor/patients",
        element: <DoctorPatients />,
      },

      // Patient Panel
      {
        path: "patient",
        element: <PatientDashboard />,
      },
      {
        path: "patient/appointments",
        element: <PatientAppointments />,
      },
      {
        path: "patient/prescriptions",
        element: <PatientPrescriptions />,
      },
      {
        path: "patient/history",
        element: <PatientMedicalHistory />,
      },
    ],
  },
]);