import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Stethoscope,
  UserCheck,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Server,
  Sparkles,
  CreditCard,
  Layers,
  Settings,
  FileText,
  Eye,
  Check,
  XCircle,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import GrowthAnalyticsChart from "../../components/panels/GrowthAnalyticsChart";
import DoctorVerificationModal from "../../components/panels/DoctorVerificationModal";
import {
  getAdminDoctors,
  getAdminPatients,
  getAdminAppointments,
  getAdminPayments,
  approveDoctor,
  rejectDoctor,
  verifyDoctorDocument,
} from "../../data/adminMockData";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState(getAdminDoctors);
  const [patients] = useState(getAdminPatients);
  const [appointments] = useState(getAdminAppointments);
  const [payments] = useState(getAdminPayments);

  const [selectedDoctorForVerify, setSelectedDoctorForVerify] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const activeDoctorsCount = doctors.filter((d) => d.status === "Active").length;
  const pendingDoctors = doctors.filter((d) => d.verificationStatus === "Pending" || d.status === "Pending");
  const pendingDoctorsCount = pendingDoctors.length;
  const totalDoctorsCount = doctors.length + 41;
  const totalPatientsCount = 12840;
  const totalAppointmentsCount = 3420;
  const todayAppointmentsCount = 64;
  const totalRevenue = 248500;
  const thisMonthRevenue = 38400;

  const platformStats = [
    { label: "Platform Growth Rate", value: "+18.4%", change: "vs last month", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Consultation Success", value: "96.2%", change: "Completed safely", icon: CheckCircle2, color: "text-sky-600 bg-sky-50 border-sky-200" },
    { label: "Platform Cloud Uptime", value: "99.98%", change: "All regions healthy", icon: Server, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Avg Doctor Response", value: "4.8 mins", change: "Immediate triage", icon: Clock, color: "text-purple-600 bg-purple-50 border-purple-200" },
  ];

  const handleOpenVerify = (doctor) => {
    setSelectedDoctorForVerify(doctor);
    setIsVerifyModalOpen(true);
  };

  const handleVerifyDoc = (doctorId, docId) => {
    const updated = verifyDoctorDocument(doctorId, docId);
    setDoctors(updated);
    const refreshed = updated.find((d) => d.id === doctorId);
    if (refreshed) setSelectedDoctorForVerify(refreshed);
  };

  const handleApprove = (doctorId) => {
    const updated = approveDoctor(doctorId);
    setDoctors(updated);
  };

  const handleReject = (doctorId, reason) => {
    const updated = rejectDoctor(doctorId, reason);
    setDoctors(updated);
  };

  return (
    <PanelLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Comprehensive supervisory intelligence across patients, doctors, appointments, revenue, and platform operations."
    >
      <div className="space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-purple-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-md border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Executive Command Console</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Medicare Platform Overview
              </h2>
              <p className="text-purple-100/80 text-xs sm:text-sm leading-relaxed">
                Supervising <strong className="text-white">{totalPatientsCount.toLocaleString()} patients</strong> and <strong className="text-white">{activeDoctorsCount} active specialists</strong> with real-time verification queues, financial oversight, and automated clinical compliance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/admin/doctors"
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-purple-50 text-slate-950 text-xs font-bold shadow-lg transition flex items-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4 text-purple-700" />
                <span>Doctor Management</span>
              </Link>
              <Link
                to="/admin/appointments"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Appointments</span>
              </Link>
              <Link
                to="/admin/payments"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" />
                <span>Revenue & Payouts</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Patients</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{totalPatientsCount.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span>+12.4%</span>
              <span className="text-slate-400 font-normal">registered users</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Doctors</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{totalDoctorsCount}</p>
            <p className="text-[11px] text-sky-600 font-bold">
              <span>{doctors.length} onboarded</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Doctors</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{activeDoctorsCount}</p>
            <p className="text-[11px] text-emerald-600 font-bold">
              <span>Verified & in clinic</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pending Verification</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600">{pendingDoctorsCount}</p>
            <p className="text-[11px] text-amber-600 font-bold">
              <span>Requires audit review</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Appointments</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{totalAppointmentsCount.toLocaleString()}</p>
            <p className="text-[11px] text-indigo-600 font-bold">
              <span>{todayAppointmentsCount} scheduled today</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              <span>${thisMonthRevenue.toLocaleString()} this month</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {platformStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-slate-500 font-bold">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Pending Doctor Registrations & Qualifications</h3>
                <p className="text-xs text-slate-400">Inspect submitted degrees and state licenses before granting active clinical access</p>
              </div>
            </div>
            <Link
              to="/admin/doctors"
              className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Manage All Doctors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-900 text-sm leading-snug">{doc.name}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {doc.verificationStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {doc.specialty} • {doc.qualification}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Registered: {doc.registeredDate} • Clinic: {doc.clinic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenVerify(doc)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Verify Qualifications</span>
                  </button>
                  <button
                    onClick={() => handleApprove(doc.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(doc.id, "Credentials pending re-submission")}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingDoctors.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
                No pending doctor verifications. All practitioner accounts are up to date!
              </div>
            )}
          </div>
        </div>

        <GrowthAnalyticsChart />

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-lg mb-4">Medicare Administration Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/admin/doctors"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Doctor Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Approve registrations, verify medical degrees, suspend/activate practitioners, edit clinic fees.
              </p>
            </Link>

            <Link
              to="/admin/patients"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Patient Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Audit registered patient accounts, filter by health plan, deactivate access, view security activity.
              </p>
            </Link>

            <Link
              to="/admin/appointments"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Appointment Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track clinical schedule, filter by doctor/date/status, cancel bookings, resolve patient disputes.
              </p>
            </Link>

            <Link
              to="/admin/payments"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Payment Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Review financial transactions, revenue breakdowns, refunds, failed payments, and doctor payout batches.
              </p>
            </Link>

            <Link
              to="/admin/content"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Content Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Configure medical specialties, hospital departments, public FAQs, clinical articles, and system announcements.
              </p>
            </Link>

            <Link
              to="/admin/system"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-purple-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">System Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                RBAC permissions matrix, security audit logs, notification triggers, system settings, and analytics reports.
              </p>
            </Link>
          </div>
        </div>
      </div>

      <DoctorVerificationModal
        doctor={selectedDoctorForVerify}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerifyDoc={handleVerifyDoc}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </PanelLayout>
  );
}
