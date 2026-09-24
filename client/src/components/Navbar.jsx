import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Pill,
  TrendingUp,
  Calendar,
  FileText,
  Activity,
  LogOut,
  PhoneCall,
  Home,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useLogout, useCheckAuth } from "../api/authApi";
import { logout, setCredentials, selectCurrentUser } from "../redux/authSlice";

const roleConfig = {
  admin: {
    name: "Admin",
    portalLabel: "Admin Portal",
    dashboardPath: "/admin",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    activePillClass: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm glow-purple",
    hoverPillClass: "text-slate-600 hover:text-purple-700 hover:bg-purple-50/70",
    avatarGradient: "bg-gradient-to-br from-purple-600 to-indigo-600",
    brandBadge: "bg-purple-100 text-purple-700 border border-purple-200",
    brandBadgeText: "ADMIN",
    accentDot: "bg-purple-500",
    roleIcon: ShieldCheck,
    links: [
      { label: "Home", path: "/", icon: Home, exact: true },
      { label: "Dashboard", path: "/admin", icon: ShieldCheck, exact: true },
      { label: "Doctors", path: "/admin/doctors", icon: Stethoscope },
      { label: "Patients", path: "/admin/patients", icon: Users },
      { label: "Medicines", path: "/admin/medicines", icon: Pill },
      { label: "Analytics", path: "/admin/analytics", icon: TrendingUp },
      { label: "Help", path: "/contact", icon: PhoneCall },
    ],
  },
  doctor: {
    name: "Doctor",
    portalLabel: "Doctor Portal",
    dashboardPath: "/doctor",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    activePillClass: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm glow-emerald",
    hoverPillClass: "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70",
    avatarGradient: "bg-gradient-to-br from-emerald-600 to-teal-600",
    brandBadge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    brandBadgeText: "DOCTOR",
    accentDot: "bg-emerald-500",
    roleIcon: Stethoscope,
    links: [
      { label: "Home", path: "/", icon: Home, exact: true },
      { label: "Dashboard", path: "/doctor", icon: Activity, exact: true },
      { label: "Appointments", path: "/doctor/appointments", icon: Calendar },
      { label: "Patients", path: "/doctor/patients", icon: Users },
      { label: "Help", path: "/contact", icon: PhoneCall },
    ],
  },
  patient: {
    name: "Patient",
    portalLabel: "Patient Portal",
    dashboardPath: "/patient",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200",
    activePillClass: "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm glow-sky",
    hoverPillClass: "text-slate-600 hover:text-sky-700 hover:bg-sky-50/70",
    avatarGradient: "bg-gradient-to-br from-sky-600 to-cyan-600",
    brandBadge: "bg-sky-100 text-sky-700 border border-sky-200",
    brandBadgeText: "PATIENT",
    accentDot: "bg-sky-500",
    roleIcon: User,
    links: [
      { label: "Home", path: "/", icon: Home, exact: true },
      { label: "Dashboard", path: "/patient", icon: Activity, exact: true },
      { label: "Appointments", path: "/patient/appointments", icon: Calendar },
      { label: "Prescriptions", path: "/patient/prescriptions", icon: Pill },
      { label: "Medical History", path: "/patient/history", icon: FileText },
      { label: "Help", path: "/contact", icon: PhoneCall },
    ],
  },
  guest: {
    name: "Guest",
    portalLabel: "Public",
    dashboardPath: "/",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    activePillClass: "bg-white text-slate-900 shadow-xs",
    hoverPillClass: "text-slate-600 hover:text-slate-900 hover:bg-white/60",
    avatarGradient: "bg-gradient-to-br from-slate-600 to-slate-800",
    brandBadge: "bg-sky-100 text-sky-700 border border-sky-200",
    brandBadgeText: "PRO",
    accentDot: "bg-emerald-500",
    roleIcon: User,
    links: [
      { label: "Home", path: "/", icon: Home, exact: true },
      { label: "Help & Support", path: "/contact", icon: PhoneCall },
    ],
  },
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const rawRole = user?.role;
  const userRole = user
    ? rawRole === "user"
      ? "patient"
      : rawRole || "patient"
    : null;

  const currentConfig = userRole ? (roleConfig[userRole] || roleConfig.patient) : roleConfig.guest;

  const isItemActive = (path, exact) => {
    if (exact || path === "/") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all duration-200 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-2xl ${
                user ? currentConfig.avatarGradient : "bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500"
              } text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300`}
            >
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${
                currentConfig.accentDot
              } border-2 border-white ring-1 ring-slate-200`}
            ></span>
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-950 via-slate-800 to-sky-950 bg-clip-text text-transparent">
                MEDICARE
              </span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider ${currentConfig.brandBadge}`}
              >
                {currentConfig.brandBadgeText}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide flex items-center gap-1">
              <span>{user ? `${currentConfig.name} Workspace` : "Healthcare Platform"}</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-bold">Online</span>
            </p>
          </div>
        </Link>

        {/* Dynamic Role-Based Navigation Links */}
        <nav className="hidden md:flex items-center p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-xs gap-0.5">
          {currentConfig.links.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  active
                    ? currentConfig.activePillClass
                    : currentConfig.hoverPillClass
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={currentConfig.dashboardPath}
                title={`Go to ${currentConfig.name} Dashboard`}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition group"
              >
                <div
                  className={`w-7 h-7 rounded-xl text-white font-bold flex items-center justify-center text-xs shadow-xs transition group-hover:scale-105 ${currentConfig.avatarGradient}`}
                >
                  {user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                    {user.username || user.email?.split("@")[0]}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${currentConfig.badgeClass}`}
                    >
                      <currentConfig.roleIcon className="w-2.5 h-2.5" />
                      {currentConfig.name}
                    </span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Sign out of Medicare"
                className="p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
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

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-200/80 mt-3 space-y-2">
          {user && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs ${currentConfig.avatarGradient}`}
                >
                  {user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {user.username || user.email?.split("@")[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium truncate max-w-[170px]">{user.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${currentConfig.badgeClass}`}
              >
                <currentConfig.roleIcon className="w-3 h-3" />
                {currentConfig.name}
              </span>
            </div>
          )}

          <div className="space-y-1">
            {currentConfig.links.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    active
                      ? `${currentConfig.activePillClass} font-extrabold`
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              );
            })}
          </div>

          {!user && (
            <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-200/80">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold rounded-xl bg-sky-600 text-white hover:bg-sky-700 shadow-xs"
              >
                Get Started
              </Link>
            </div>
          )}

          {user && (
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;