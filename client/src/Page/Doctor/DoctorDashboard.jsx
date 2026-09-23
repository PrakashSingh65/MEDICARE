import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  Star,
  Plus,
  Eye,
  Activity,
  ArrowRight,
  Sparkles,
  MapPin,
  HeartPulse,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PrescriptionModal from "../../components/panels/PrescriptionModal";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import DoctorHistoryModal from "../../components/panels/DoctorHistoryModal";
import {
  getDoctors,
  getPatients,
  getAppointments,
  updateAppointmentStatus,
} from "../../data/mockData";

export default function DoctorDashboard() {
  const doctors = getDoctors();
  const currentDoctor = doctors[0]; // Dr. Priya Sharma
  const [appointments, setAppointments] = useState(getAppointments);
  const patients = getPatients();

  // Modals
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  const [isPatientHistoryOpen, setIsPatientHistoryOpen] = useState(false);

  const [isDoctorHistoryOpen, setIsDoctorHistoryOpen] = useState(false);

  // Status updates
  const handleStatusChange = (id, newStatus) => {
    const updated = updateAppointmentStatus(id, newStatus);
    setAppointments([...updated]);
  };

  const handleOpenPrescription = (patientName) => {
    const patientObj = patients.find((p) => p.name.toLowerCase() === patientName?.toLowerCase()) || patients[0];
    setSelectedPatientForPrescription(patientObj);
    setIsPrescriptionModalOpen(true);
  };

  const handleOpenPatientHistory = (patientName) => {
    const patientObj = patients.find((p) => p.name.toLowerCase() === patientName?.toLowerCase()) || patients[0];
    setSelectedPatientForHistory(patientObj);
    setIsPatientHistoryOpen(true);
  };

  const todayAppointments = appointments.slice(0, 4);

  return (
    <PanelLayout
      role="doctor"
      title={`Clinical Operations: ${currentDoctor.name}`}
      subtitle="Supervise your scheduled consultations, examine patient medical charts, issue digital prescriptions, and record diagnoses."
    >
      <div className="space-y-8">
        {/* Doctor Identity Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.name}
                  className="w-22 h-22 rounded-3xl object-cover border-2 border-white/90 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse"></span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-white/15 text-emerald-200 text-xs font-bold backdrop-blur-md border border-white/10">
                    On Duty Specialist
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">• {currentDoctor.qualification}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{currentDoctor.name}</h2>
                <p className="text-emerald-100/90 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentDoctor.specialty}</span>
                  <span>•</span>
                  <span>{currentDoctor.clinic}</span>
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-300 bg-black/20 px-2 py-0.5 rounded-lg">
                    ★ {currentDoctor.rating} (120+ clinical reviews)
                  </span>
                  <span className="font-extrabold text-white">Fee: {currentDoctor.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsDoctorHistoryOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md transition flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>My Case History</span>
              </button>
              <button
                onClick={() => handleOpenPrescription(patients[0]?.name)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Quick Prescription</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Doctor KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Today's Consultations</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{todayAppointments.length}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                2 Confirmed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Scheduled for today</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Total Patient Caseload</span>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{currentDoctor.patientsCount}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +12 this month
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Patients treated</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Practice Earnings</span>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">$8,450</span>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">+15% MoM</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Earned this fiscal cycle</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Clinical Satisfaction</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">4.9 / 5.0</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Top 5%</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Cardiology peer rating</p>
          </div>
        </div>

        {/* Today's Queue Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Today's Consultation Schedule</h3>
              <p className="text-xs text-slate-400">Patient arrival queue, chief symptoms, and immediate actions</p>
            </div>
            <Link
              to="/doctor/appointments"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              <span>Full Schedule ({appointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-3xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <p className="font-extrabold text-slate-900 text-base">{apt.patientName}</p>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {apt.time}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          apt.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : apt.status === "Completed"
                            ? "bg-sky-100 text-sky-800 border-sky-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      <span className="text-slate-400 font-normal">Reported Chief Complaint: </span>
                      {apt.symptoms}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Visit Type: {apt.type} • Consultation Date: {apt.date}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleOpenPatientHistory(apt.patientName)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Patient History</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrescription(apt.patientName)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribe & Complete</span>
                  </button>

                  {apt.status === "Pending" && (
                    <button
                      onClick={() => handleStatusChange(apt.id, "Confirmed")}
                      className="px-3 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor's Consultation History Archive */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Your Recent Consultation Archive</h3>
              <p className="text-xs text-slate-400">Clinical summaries and treatments recorded by you</p>
            </div>
            <button
              onClick={() => setIsDoctorHistoryOpen(true)}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Expand All History
            </button>
          </div>

          <div className="space-y-3">
            {(currentDoctor.consultationHistory || []).map((h, i) => (
              <div key={h.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{h.patientName}</span>
                  <span className="text-slate-400 font-medium">{h.date}</span>
                </div>
                <p className="text-slate-600">
                  <span className="font-bold text-slate-700">Diagnosis: </span>
                  {h.diagnosis}
                </p>
                <p className="text-slate-600">
                  <span className="font-bold text-slate-700">Prescription: </span>
                  {h.treatment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patient={selectedPatientForPrescription}
        doctorName={currentDoctor.name}
        doctorSpecialty={currentDoctor.specialty}
      />

      <PatientHistoryModal
        isOpen={isPatientHistoryOpen}
        onClose={() => setIsPatientHistoryOpen(false)}
        patient={selectedPatientForHistory}
      />

      <DoctorHistoryModal
        doctor={currentDoctor}
        isOpen={isDoctorHistoryOpen}
        onClose={() => setIsDoctorHistoryOpen(false)}
      />
    </PanelLayout>
  );
}
