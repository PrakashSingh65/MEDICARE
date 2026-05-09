import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Page/Home";
import Login from "../Page/Login";
import Signup from "../Page/Signup";
import AdminDashboard from "../Page/Admin/AdminDashboard";
import Doctorlist from "../Page/Admin/Doctorlist";
import UsersList from "../Page/Admin/UsersList";

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
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin/doctors",
        element: <Doctorlist />,
      },
      {
        path: "admin/users",
        element: <UsersList />,
      },
    ],
  },
]);