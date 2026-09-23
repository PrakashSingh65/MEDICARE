import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Stethoscope,
  User,
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
} from "lucide-react";

export default function PanelLayout({ role = "admin", title, subtitle, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navigationConfig = {
    admin: [
      { name: "Overview & Growth", path: "/admin", icon: TrendingUp },
      { name: "Doctors Directory", path: "/admin/doctors", icon: Stethoscope },
      { name: "Patients Directory", path: "/admin/patients", icon: Users },
      { name: "Medicine Inventory", path: "/admin/medicines", icon: Pill },
      { name: "Revenue & Analytics", path: "/admin/analytics", icon: Activity },
    ],
    doctor: [
      { name: "Doctor Dashboard", path: "/doctor", icon: Activity },
      { name: "My Appointments", path: "/doctor/appointments", icon: Calendar },
      { name: "Patient Records", path: "/doctor/patients", icon: Users },
    ],
    patient: [
      { name: "Patient Dashboard", path: "/patient", icon: Activity },
      { name: "My Appointments", path: "/patient/appointments", icon: Calendar },
      { name: "Prescriptions & Meds", path: "/patient/prescriptions", icon: Pill },
      { name: "Medical History", path: "/patient/history", icon: FileText },
    ],
  };

  const navItems = navigationConfig[role] || navigationConfig.admin;

  const roleStyles = {
    admin: {
      badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
      accentBg: "bg-sky-600 hover:bg-sky-700 text-white",
      activeNav: "bg-sky-50 text-sky-700 border-sky-500 font-semibold",
      title: "Admin Control Center",
    },
    doctor: {
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accentBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      activeNav: "bg-emerald-50 text-emerald-700 border-emerald-500 font-semibold",
      title: "Doctor Clinical Portal",
    },
    patient: {
      badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
      accentBg: "bg-sky-600 hover:bg-sky-700 text-white",
      activeNav: "bg-sky-50 text-sky-700 border-sky-500 font-semibold",
      title: "Patient Wellness Hub",
    },
  };

  const currentRoleStyle = roleStyles[role] || roleStyles.admin;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Role Switcher Toolbar */}
      <div className="bg-slate-900 text-white px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400 font-medium">Active Mode:</span>
          <span className="font-semibold uppercase tracking-wider text-white">
            {role.toUpperCase()} PANEL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Switch Panel:</span>
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <Link
              to="/admin"
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                role === "admin"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
            <Link
              to="/doctor"
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                role === "doctor"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </Link>
            <Link
              to="/patient"
              className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
                role === "patient"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white p-5 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                M+
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm leading-tight">MEDICARE</p>
                <p className="text-xs text-slate-500 capitalize">{role} Workspace</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-3 mb-2">
              Menu Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? `${currentRoleStyle.activeNav} border-l-4`
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-sky-600" />}
                </Link>
              );
            })}
          </nav>

          {/* Quick Support / Status Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 space-y-2 text-xs shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">Live Services</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-slate-200 font-semibold">24/7 Support Hotline</p>
            <p className="text-slate-400 text-[11px]">Direct emergency & consultation dispatch available.</p>
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium text-[11px]"
            >
              <span>Contact Desk</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-semibold text-slate-900 text-sm">{title || currentRoleStyle.title}</span>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${currentRoleStyle.badgeBg}`}>
            {role.toUpperCase()}
          </span>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-1 shadow-lg animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? `${currentRoleStyle.activeNav} border-l-4`
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

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          {(title || subtitle) && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${currentRoleStyle.badgeBg}`}>
                      {role} panel
                    </span>
                    <span className="text-slate-400 text-xs">• Medicare System</span>
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {title}
                  </h1>
                  {subtitle && <p className="mt-1 text-sm text-slate-600 max-w-2xl">{subtitle}</p>}
                </div>
              </div>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
