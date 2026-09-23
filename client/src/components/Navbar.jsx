import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShieldCheck,
  Stethoscope,
  User,
  Activity,
  LogOut,
  Sparkles,
  PhoneCall,
  Home,
  ChevronRight,
} from "lucide-react";
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

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all duration-200 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400"></span>
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-sky-950 bg-clip-text text-transparent">
                MEDICARE
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-sky-100 text-sky-700 tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide flex items-center gap-1">
              <span>Healthcare Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-bold">Live v2.4</span>
            </p>
          </div>
        </Link>

        {/* Central Role Selector Pills */}
        <nav className="hidden md:flex items-center p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-xs">
          <Link
            to="/"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isActive("/") && location.pathname === "/"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <Link
            to="/admin"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isActive("/admin")
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm glow-purple"
                : "text-slate-600 hover:text-purple-700"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <Link
            to="/doctor"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isActive("/doctor")
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm glow-emerald"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor</span>
          </Link>

          <Link
            to="/patient"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isActive("/patient")
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm glow-sky"
                : "text-slate-600 hover:text-sky-700"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient</span>
          </Link>

          <Link
            to="/contact"
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isActive("/contact")
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>
        </nav>

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {user.username?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {user.username || user.email.split("@")[0]}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-400 capitalize">
                    {user.role || "Member"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Sign out of Medicare"
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-sky-600/20 hover:brightness-105 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;