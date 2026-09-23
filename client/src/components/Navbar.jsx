import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, Stethoscope, User, HeartPulse, LogOut } from "lucide-react";
import { useLogout, useCheckAuth } from "../api/authApi";
import { logout, setCredentials, selectCurrentUser } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const { data: persistedUser } = useCheckAuth();
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    if (persistedUser?.user) {
      dispatch(setCredentials(persistedUser.user));
    } else if (persistedUser && (persistedUser.username || persistedUser.email)) {
      dispatch(setCredentials(persistedUser));
    }
  }, [persistedUser, dispatch]);

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 sm:px-8 py-3.5 shadow-xs backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 group">
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <span className="text-lg tracking-tight font-extrabold text-slate-900">MEDICARE</span>
            <span className="block text-[10px] text-sky-600 font-bold uppercase tracking-wider">Health Portal</span>
          </div>
        </Link>

        {/* Navigation Panels */}
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold">
          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              isActive("/admin")
                ? "bg-purple-100 text-purple-900 font-bold shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Admin</span>
          </Link>

          <Link
            to="/doctor"
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              isActive("/doctor")
                ? "bg-emerald-100 text-emerald-900 font-bold shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Doctor</span>
          </Link>

          <Link
            to="/patient"
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              isActive("/patient")
                ? "bg-sky-100 text-sky-900 font-bold shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4 text-sky-600" />
            <span>Patient</span>
          </Link>

          <Link
            to="/contact"
            className={`px-3 py-1.5 rounded-xl transition ${
              isActive("/contact")
                ? "bg-slate-100 text-slate-900 font-bold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Auth / Account Area */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-800 text-xs font-semibold">
                {user.username || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-white text-xs font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isLoggingOut ? "Signing out..." : "Logout"}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-3 py-1.5 text-slate-700 hover:bg-slate-100 font-semibold transition text-xs sm:text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-sky-600 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white transition hover:bg-sky-700 shadow-xs"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;