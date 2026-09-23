import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { selectCurrentUser } from "../redux/authSlice";
import { useCheckAuth } from "../api/authApi";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const reduxUser = useSelector(selectCurrentUser);
  const { data: authData, isLoading } = useCheckAuth();

  const user = reduxUser || authData?.user;

  if (isLoading && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Verifying session credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role === "user" ? "patient" : user.role;

  if (allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => (r === "user" ? "patient" : r));
    const hasRole = normalizedAllowed.includes(userRole);

    if (!hasRole) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-red-100 shadow-xl shadow-red-500/5 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your account role is <span className="font-bold text-slate-800 capitalize">{userRole}</span>.
                This area requires:{" "}
                <span className="font-bold text-sky-600 uppercase">
                  {normalizedAllowed.join(", ")}
                </span>.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={userRole === "admin" ? "/admin" : userRole === "doctor" ? "/doctor" : "/patient"}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go to My Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}
