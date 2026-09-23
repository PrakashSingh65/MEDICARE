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
      title={`Welcome back, ${currentDoctor.name}`}
      subtitle="Manage your daily patient queue, clinical diagnoses, appointments, and digital prescriptions."
    >
      <div className="space-y-8">
        {/* Doctor Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <img
                src={currentDoctor.avatar}
                alt={currentDoctor.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
                  Active Clinical Duty
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{currentDoctor.name}</h2>
                <p className="text-emerald-100 text-xs sm:text-sm">
                  {currentDoctor.specialty} • {currentDoctor.clinic}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-emerald-200">
                  <span className="flex items-center gap-1 font-bold text-white">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {currentDoctor.rating} (120+ reviews)
                  </span>
                  <span>•</span>
                  <span>Fee: {currentDoctor.fee}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsDoctorHistoryOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-emerald-50 text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>My Consultation History</span>
              </button>
              <button
                onClick={() => handleOpenPrescription(patients[0]?.name)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-xs transition flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Quick Prescription</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Doctor KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Today's Visits</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{todayAppointments.length} Patients</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">2 confirmed, 1 pending</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Total Treated Patients</span>
              <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{currentDoctor.patientsCount}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12 new</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Under your primary care</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Practice Earnings</span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">$8,450</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+15%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Collected this month</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Patient Satisfaction</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Star className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">4.9 / 5.0</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Top 5% in Cardiology</p>
          </div>
        </div>

        {/* Today's Patient Schedule Queue */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Today's Appointment Schedule</h3>
              <p className="text-xs text-slate-500">Upcoming consultations, patient chief complaints, and actions</p>
            </div>
            <Link
              to="/doctor/appointments"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View Full Schedule ({appointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 p-3 rounded-2xl transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 text-sm">{apt.patientName}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {apt.time}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : apt.status === "Completed"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      <span className="text-slate-400">Chief Complaint: </span>
                      {apt.symptoms}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Type: {apt.type} • Consultation Date: {apt.date}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenPatientHistory(apt.patientName)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Patient History</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrescription(apt.patientName)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribe / Complete</span>
                  </button>

                  {apt.status === "Pending" && (
                    <button
                      onClick={() => handleStatusChange(apt.id, "Confirmed")}
                      className="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition"
                    >
                      Accept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor's Consultation History preview */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Your Recent Consultation History</h3>
              <p className="text-xs text-slate-500">Past patient case logs and treatments recorded by you</p>
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
              <div key={h.id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{h.patientName}</span>
                  <span className="text-slate-400">{h.date}</span>
                </div>
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-700">Diagnosis: </span>
                  {h.diagnosis}
                </p>
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-700">Prescription: </span>
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
