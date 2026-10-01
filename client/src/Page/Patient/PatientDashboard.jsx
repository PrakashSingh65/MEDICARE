import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Pill,
  FileText,
  Clock,
  User,
  Heart,
  Plus,
  ShieldCheck,
  Stethoscope,
  Activity,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Video,
  CreditCard,
  Bell,
  FolderOpen,
  Phone,
  AlertTriangle,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getPatientProfile,
  getPatientAppointments,
  getPatientRecords,
  getPatientPrescriptions,
  getPatientNotifications,
  syncPatientAppointments,
  syncPatientPrescriptions,
  syncPatientNotifications,
} from "../../data/patientMockData";

export default function PatientDashboard() {
  const [profile] = useState(getPatientProfile);
  const [appointments, setAppointments] = useState(getPatientAppointments);
  const [records] = useState(getPatientRecords);
  const [prescriptions, setPrescriptions] = useState(getPatientPrescriptions);
  const [notifications, setNotifications] = useState(getPatientNotifications);

  useEffect(() => {
    syncPatientAppointments().then((data) => {
      if (data && Array.isArray(data)) setAppointments(data);
    });
    syncPatientPrescriptions().then((data) => {
      if (data && Array.isArray(data)) setPrescriptions(data);
    });
    syncPatientNotifications().then((data) => {
      if (data && Array.isArray(data)) setNotifications(data);
    });
  }, []);

  const upcomingAppointments = appointments.filter((a) => a.isUpcoming && a.status === "Confirmed");
  const nextAppointment = upcomingAppointments[0];
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <PanelLayout
      role="patient"
      title="Patient Wellness Dashboard"
      subtitle="Supervise your scheduled medical consultations, track digital prescriptions, access laboratory reports, and inspect diagnostic charts."
    >
      <div className="space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-sky-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-3xl object-cover border-2 border-white/80 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-3xl font-black text-white">{profile.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-400/20 text-sky-200 border border-sky-400/30">
                    {profile.plan}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-sky-200 font-medium">
                  {profile.gender} • Blood Group: <strong className="text-white font-black">{profile.bloodGroup}</strong> • Age: 29
                </p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{profile.city}</span>
                  <span>•</span>
                  <span>Ph: {profile.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/patient/appointments"
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-slate-950 text-xs font-bold shadow-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Book Appointment</span>
              </Link>
              <Link
                to="/patient/consultation"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Video className="w-4 h-4" />
                <span>Consultation Room</span>
              </Link>
              <Link
                to="/patient/records"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Medical Records</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Upcoming Visits</span>
            <p className="text-2xl font-black text-slate-900">{upcomingAppointments.length}</p>
            <p className="text-[11px] text-sky-600 font-bold">Next: {nextAppointment?.date || "None scheduled"}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Prescriptions</span>
            <p className="text-2xl font-black text-purple-600">{prescriptions.length}</p>
            <p className="text-[11px] text-purple-700 font-bold">3 active prescribed medications</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Diagnostic Reports</span>
            <p className="text-2xl font-black text-emerald-600">{records.uploadedDocuments?.length || 0}</p>
            <p className="text-[11px] text-emerald-700 font-bold">All reports validated</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Unread Alerts</span>
            <p className="text-2xl font-black text-amber-600">{unreadNotifications.length}</p>
            <Link to="/patient/notifications" className="text-[11px] text-amber-700 font-bold hover:underline">
              View notifications →
            </Link>
          </div>
        </div>

        {nextAppointment && (
          <div className="bg-white rounded-3xl border border-sky-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden bg-gradient-to-br from-white to-sky-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={nextAppointment.doctorAvatar}
                  alt={nextAppointment.doctorName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                      Next Scheduled Consultation
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">#{nextAppointment.appointmentNumber}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{nextAppointment.doctorName}</h3>
                  <p className="text-xs text-purple-700 font-bold">{nextAppointment.doctorSpecialty} • {nextAppointment.clinic}</p>
                  <p className="text-xs text-slate-600 font-semibold flex items-center gap-2 pt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{nextAppointment.date} at {nextAppointment.time}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{nextAppointment.type} ({nextAppointment.room})</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to="/patient/consultation"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Consultation Room</span>
                </Link>
                <Link
                  to="/patient/appointments"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold transition"
                >
                  Manage Booking
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Active Electronic Prescriptions</h3>
                  <p className="text-[11px] text-slate-400">Current therapies and dosage instructions</p>
                </div>
              </div>
              <Link to="/patient/prescriptions" className="text-xs font-bold text-purple-600 hover:underline">
                View All ({prescriptions.length})
              </Link>
            </div>

            <div className="space-y-2.5">
              {prescriptions[0]?.medicines?.map((med, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-black text-slate-900">{med.name} ({med.dosage})</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{med.instructions}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-purple-700 block">{med.frequency}</span>
                    <span className="text-[10px] text-slate-400">{med.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Recent Diagnostic Reports</h3>
                  <p className="text-[11px] text-slate-400">Validated laboratory panels & scans</p>
                </div>
              </div>
              <Link to="/patient/records" className="text-xs font-bold text-emerald-600 hover:underline">
                All Records
              </Link>
            </div>

            <div className="space-y-2.5">
              {records.uploadedDocuments?.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-extrabold text-slate-900 truncate max-w-xs">{doc.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{doc.category} • {doc.uploadDate}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                    {doc.fileSize}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base mb-4">Patient Portal Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/patient/profile"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-xs transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Profile & Demographics</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Date of birth, blood group, emergency contacts, address, photo, and verification.
              </p>
            </Link>

            <Link
              to="/patient/appointments"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-xs transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Book Appointments</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Search specialists by department, choose time slots, reschedule, and set reminders.
              </p>
            </Link>

            <Link
              to="/patient/consultation"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-xs transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Telehealth Consults</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Video/audio calls, doctor-patient messaging, and document sharing during visits.
              </p>
            </Link>

            <Link
              to="/patient/payments"
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-xs transition group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs">Payments & Invoices</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pay consultation fees, download receipts, review payment history, and refund claims.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
