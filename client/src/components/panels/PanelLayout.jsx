import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/authSlice";
import {
  Stethoscope,
  Users,
  Pill,
  TrendingUp,
  Calendar,
  FileText,
  Clock,
  Menu,
  X,
  ChevronRight,
  Activity,
  ArrowUpRight,
  HeartPulse,
  Bell,
  Sparkles,
  LifeBuoy,
  CreditCard,
  Layers,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export default function PanelLayout({ role = "admin", title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.imageUrl]);

  const navigationConfig = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Doctor Management", path: "/admin/doctors", icon: Stethoscope },
      { name: "Patient Management", path: "/admin/patients", icon: Users },
      { name: "Appointments", path: "/admin/appointments", icon: Calendar },
      { name: "Payments & Revenue", path: "/admin/payments", icon: CreditCard },
      { name: "Content Management", path: "/admin/content", icon: Layers },
      { name: "System Management", path: "/admin/system", icon: Settings },
      { name: "Medicine Inventory", path: "/admin/medicines", icon: Pill },
    ],
    doctor: [
      { name: "Clinical Dashboard", path: "/doctor", icon: Activity },
      { name: "My Appointments", path: "/doctor/appointments", icon: Calendar },
      { name: "Patient Charts", path: "/doctor/patients", icon: Users },
    ],
    patient: [
      { name: "Wellness Dashboard", path: "/patient", icon: Activity },
      { name: "My Appointments", path: "/patient/appointments", icon: Calendar },
      { name: "Prescriptions & Meds", path: "/patient/prescriptions", icon: Pill },
      { name: "Medical History", path: "/patient/history", icon: FileText },
    ],
  };

  const navItems = navigationConfig[role] || navigationConfig.admin;

  const roleThemes = {
    admin: {
      accentGradient: "from-purple-600 via-indigo-600 to-slate-900",
      activeBg: "bg-purple-50/80 text-purple-900 border-purple-600 font-bold shadow-xs",
      activeIcon: "text-purple-600",
      badge: "bg-purple-100 text-purple-800 border-purple-200",
      iconBg: "bg-purple-600",
      roleLabel: "Administrator Portal",
      glowClass: "glow-purple",
    },
    doctor: {
      accentGradient: "from-emerald-600 via-teal-600 to-slate-900",
      activeBg: "bg-emerald-50/80 text-emerald-900 border-emerald-600 font-bold shadow-xs",
      activeIcon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      iconBg: "bg-emerald-600",
      roleLabel: "Doctor Clinical Portal",
      glowClass: "glow-emerald",
    },
    patient: {
      accentGradient: "from-sky-600 via-cyan-600 to-slate-900",
      activeBg: "bg-sky-50/80 text-sky-900 border-sky-600 font-bold shadow-xs",
      activeIcon: "text-sky-600",
      badge: "bg-sky-100 text-sky-800 border-sky-200",
      iconBg: "bg-sky-600",
      roleLabel: "Patient Wellness Hub",
      glowClass: "glow-sky",
    },
  };

  const theme = roleThemes[role] || roleThemes.admin;

  return (
    <div className="min-h-screen mesh-bg flex flex-col antialiased">
      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="hidden lg:flex flex-col w-72 border-r border-slate-200/80 bg-white/90 backdrop-blur-md p-5 space-y-6">
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-3">
              {user?.imageUrl && !avatarError ? (
                <img
                  src={user.imageUrl}
                  alt={user.username || theme.roleLabel}
                  onError={() => setAvatarError(true)}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                />
              ) : (
                <div
                  className={`w-11 h-11 rounded-2xl ${theme.iconBg} text-white flex items-center justify-center font-black text-lg shadow-md shrink-0`}
                >
                  {role === "admin" ? "A" : role === "doctor" ? "Dr" : "Pt"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                  {user?.username || theme.roleLabel}
                </p>
                <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="truncate">{theme.roleLabel}</span>
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 mb-2">
              Navigation Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? `${theme.activeBg} border-l-4`
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? theme.activeIcon : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive ? (
                    <ChevronRight className={`w-4 h-4 ${theme.activeIcon}`} />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 space-y-3 text-xs shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5" />
                Live Cloud Sync
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-slate-200 font-bold text-sm">24/7 Clinical Network</p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Instant appointment notifications & pharmacy stock alerts active.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white transition pt-1"
            >
              <span>Emergency Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </aside>

        <div className="lg:hidden glass-nav border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-extrabold text-slate-900 text-sm">{title || theme.roleLabel}</span>
          </div>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${theme.badge}`}>
            {role.toUpperCase()}
          </span>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-1.5 shadow-xl animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold ${
                    isActive
                      ? `${theme.activeBg} border-l-4`
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-6">
          {(title || subtitle) && (
            <div className="bg-white/80 backdrop-blur-xs p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                      {role} Portal
                    </span>
                    <span className="text-slate-400 text-xs">• Verified Clinical System</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-slate-100/50 to-transparent pointer-events-none" />
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
