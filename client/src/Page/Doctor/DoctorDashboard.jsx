import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  Video,
  FileText,
  Pill,
  ShieldCheck,
  Building,
  ArrowRight,
  Star,
  Sparkles,
  Sliders,
  FolderOpen,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getDoctorProfile,
  getDoctorAppointments,
  getDoctorPatients,
  getMonthlyStatistics,
  acceptAppointment,
  rejectAppointment,
  syncDoctorAppointments,
  syncDoctorProfile,
} from "../../data/doctorMockData";
import { getDoctorDashboard } from "../../api/doctorApi";

export default function DoctorDashboard() {
  const [profile, setProfile] = useState(getDoctorProfile);
  const [appointments, setAppointments] = useState(getDoctorAppointments);
  const [patients, setPatients] = useState(getDoctorPatients);
  const [docDashboardData, setDocDashboardData] = useState(null);
  const monthlyStats = getMonthlyStatistics();

  useEffect(() => {
    let active = true;
    getDoctorDashboard()
      .then((res) => {
        if (active && res?.data) {
          setDocDashboardData(res.data);
        }
      })
      .catch((err) => console.warn("Doctor dashboard live stats notice:", err.message));

    syncDoctorAppointments()
      .then((appts) => {
        if (active && appts) setAppointments(appts);
      })
      .catch(() => null);

    syncDoctorProfile()
      .then((p) => {
        if (active && p) setProfile(p);
      })
      .catch(() => null);

    return () => {
      active = false;
    };
  }, []);

  const todayAppointments = appointments.filter(
    (a) => a.isToday || a.date === new Date().toISOString().split("T")[0]
  );
  const pendingAppointments = appointments.filter((a) => a.status === "Pending" || a.status === "Scheduled");
  const completedAppointments = appointments.filter((a) => a.status === "Completed");

  const totalPatients = docDashboardData?.totalPatients ?? (patients.length + 137);
  const completedCount = docDashboardData?.completedConsultations ?? (completedAppointments.length + 116);
  const pendingCount = docDashboardData?.pendingAppointments ?? pendingAppointments.length;
  const totalRevenue = docDashboardData?.revenue?.grossFeeCollected
    ? docDashboardData.revenue.grossFeeCollected * 100
    : 10650;
  const thisMonthRevenue = docDashboardData?.revenue?.netDoctorRevenue
    ? docDashboardData.revenue.netDoctorRevenue * 100
    : 4350;

  const handleAccept = (id) => {
    const updated = acceptAppointment(id);
    setAppointments(updated);
  };

  const handleReject = (id) => {
    const updated = rejectAppointment(id);
    setAppointments(updated);
  };

  const maxAppts = Math.max(...monthlyStats.map((s) => s.appointments));

  return (
    <PanelLayout
      role="doctor"
      title="Doctor Clinical Dashboard"
      subtitle="Supervise your daily clinical consultations, track revenue, examine patient case files, and manage your practice schedule."
    >
      <div className="space-y-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 rounded-3xl object-cover border-2 border-white/80 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-3xl font-black text-white">{profile.name}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    {profile.verificationStatus}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 font-bold">{profile.specialization}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.clinicName}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/doctor/consultation"
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-950 text-xs font-bold shadow-lg transition flex items-center gap-1.5"
              >
                <Video className="w-4 h-4 text-emerald-600" />
                <span>Start Video Consult</span>
              </Link>
              <Link
                to="/doctor/schedule"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Manage Schedule</span>
              </Link>
              <Link
                to="/doctor/prescriptions"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Pill className="w-4 h-4" />
                <span>Write Prescription</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Today's Visits</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{todayAppointments.length}</p>
            <p className="text-[11px] text-emerald-600 font-bold">
              <span>Scheduled encounters</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Patients</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{totalPatients}</p>
            <p className="text-[11px] text-purple-600 font-bold">
              <span>Assigned records</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Completed Visits</span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-sky-600">{completedCount}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              <span>All-time consultations</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pending Requests</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
            <p className="text-[11px] text-amber-600 font-bold">
              <span>Awaiting acceptance</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Gross Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600">${totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              <span>90% doctor share</span>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">This Month</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-indigo-600">${thisMonthRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-bold">
              <span>+14.8% growth</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Monthly Appointment Statistics & Revenue</h3>
              <p className="text-xs text-slate-400">Consultation volume and monthly earnings trend over the past 7 months</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Avg 48 appointments / month
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 items-end pt-6">
            {monthlyStats.map((stat, i) => {
              const heightPercent = Math.round((stat.appointments / maxAppts) * 100);
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500">${stat.revenue}</span>
                  <div className="w-full bg-slate-100 rounded-2xl h-44 flex items-end p-1.5">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-xl bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-500 hover:brightness-110 flex items-center justify-center text-[10px] font-black text-white shadow-xs"
                    >
                      {stat.appointments}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">{stat.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Today's Appointment Schedule</h3>
                <p className="text-xs text-slate-400">Patients booked for today ({todayAppointments.length} consultations)</p>
              </div>
            </div>
            <Link
              to="/doctor/appointments"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>View All Appointments</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={apt.patientAvatar}
                    alt={apt.patientName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-slate-900 text-sm leading-snug">{apt.patientName}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {apt.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {apt.patientAge}y, {apt.patientGender} • {apt.type} ({apt.room})
                    </p>
                    <p className="text-[11px] text-slate-400 italic mt-0.5 truncate max-w-md">
                      Reason: {apt.symptoms}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {apt.status === "Pending" ? (
                    <>
                      <button
                        onClick={() => handleAccept(apt.id)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(apt.id)}
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/doctor/consultation"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Consult</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-lg mb-4">Doctor Clinical Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/doctor/profile"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Professional Profile</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Specialization, qualifications, experience, fees, hospital affiliations, languages, and credentials.
              </p>
            </Link>

            <Link
              to="/doctor/schedule"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Schedule Management</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Working days, consultation hours, slot durations, blocked dates, and vacation/leave requests.
              </p>
            </Link>

            <Link
              to="/doctor/appointments"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Appointments Ledger</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Today's and upcoming appointments, accept/reject requests, reschedule bookings, and patient history.
              </p>
            </Link>

            <Link
              to="/doctor/patients"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Patient Medical Charts</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Comprehensive patient roster, clinical histories, previous consults, allergies, and active drugs.
              </p>
            </Link>

            <Link
              to="/doctor/consultation"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Live Consultation Room</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Video calling, patient chat, clinical notes, symptoms, diagnosis, and treatment plan recording.
              </p>
            </Link>

            <Link
              to="/doctor/prescriptions"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Electronic Prescriptions</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dynamic drug addition, dosages, frequency, duration, PDF/print generation, and prescription records.
              </p>
            </Link>

            <Link
              to="/doctor/reports"
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">Medical Reports & Scans</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Upload diagnostic reports, inspect lab results, and record expert clinical interpretations.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
