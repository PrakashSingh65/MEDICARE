import React, { useState } from "react";
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
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import BookAppointmentModal from "../../components/panels/BookAppointmentModal";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import { getPatients, getAppointments, getDoctors } from "../../data/mockData";

export default function PatientDashboard() {
  const patients = getPatients();
  const currentPatient = patients[0]; // Aditi Kapoor
  const [appointments, setAppointments] = useState(getAppointments);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const patientAppointments = appointments.filter(
    (a) => a.patientName.toLowerCase() === currentPatient.name.toLowerCase()
  );

  const nextAppointment = patientAppointments[0];
  const medicalHistory = currentPatient.medicalHistory || [];
  const latestVisit = medicalHistory[0];

  return (
    <PanelLayout
      role="patient"
      title={`Welcome back, ${currentPatient.name}`}
      subtitle="Your personal health record, active medication dosages, upcoming specialist visits, and wellness metrics."
    >
      <div className="space-y-8">
        {/* Next Appointment & Care Journey Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-700 via-indigo-800 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-sky-600/30">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-bold backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Medicare {currentPatient.plan} Health Plan Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {nextAppointment ? "Upcoming Specialist Consultation" : "Keep Your Preventive Care on Track"}
              </h2>

              {nextAppointment ? (
                <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed">
                  You have a confirmed appointment with <strong className="text-white">{nextAppointment.doctorName}</strong> ({nextAppointment.doctorSpecialty}) on <strong className="text-white">{nextAppointment.date}</strong> at <strong className="text-white">{nextAppointment.time}</strong>.
                </p>
              ) : (
                <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed">
                  Schedule your routine checkup or consult with our verified cardiologists, pediatricians, and specialists.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-sky-50 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>My Full Health History</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Health Vitals & Profile Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Blood Profile</span>
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{currentPatient.bloodGroup || "B+"}</span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Rh Positive</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Verified lab record</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Scheduled Appointments</span>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{patientAppointments.length}</span>
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Specialist consultations</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Active Prescriptions</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">2</span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">On Schedule</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Amlodipine, Propranolol</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400">Lifetime Consults</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{currentPatient.totalVisits || 6}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Encounters</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Logged in medical chart</p>
          </div>
        </div>

        {/* Dual Grid: Appointments & Active Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scheduled Appointments */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">My Upcoming Appointments</h3>
                    <p className="text-xs text-slate-400">Confirmed clinic consultations</p>
                  </div>
                </div>
                <Link
                  to="/patient/appointments"
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
                >
                  <span>All Visits</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {patientAppointments.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 font-medium">
                  No scheduled doctor appointments found.
                </div>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-sky-50/40 hover:border-sky-200 transition space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">{apt.doctorName}</span>
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{apt.doctorSpecialty} • {apt.type}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsBookModalOpen(true)}
              className="mt-6 w-full py-3 rounded-2xl border border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-100 text-sky-700 font-extrabold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Book Another Specialist Visit</span>
            </button>
          </div>

          {/* Active Medications Protocol */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Active Medications</h3>
                    <p className="text-xs text-slate-400">Current prescription treatment plan</p>
                  </div>
                </div>
                <Link
                  to="/patient/prescriptions"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
                >
                  <span>View All Meds</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">Amlodipine 5mg</span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Ongoing Daily
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Dosage: 1 Tablet • Every morning after breakfast
                  </p>
                  <p className="text-[11px] text-slate-400">Prescribed by Dr. Priya Sharma for BP control</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Propranolol 10mg</span>
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200">
                      As Needed (SOS)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Dosage: 1 Tablet • During acute palpitations or high stress
                  </p>
                  <p className="text-[11px] text-slate-400">Prescribed by Dr. Priya Sharma</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Medicare Express Pharmacy Refill</span>
              <Link to="/patient/prescriptions" className="font-extrabold text-purple-600 hover:underline">
                Order Delivery
              </Link>
            </div>
          </div>
        </div>

        {/* Most Recent Doctor Consultation Summary */}
        {latestVisit && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs uppercase font-extrabold text-sky-600 tracking-wider">
                  Latest Clinical Record
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Encounter with {latestVisit.doctorName} ({latestVisit.specialty})
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {latestVisit.date}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5 text-xs text-slate-700">
              <p>
                <strong className="text-slate-900 font-extrabold">Clinical Diagnosis: </strong>
                {latestVisit.diagnosis}
              </p>
              <p>
                <strong className="text-slate-900 font-extrabold">Diagnostic Lab Results: </strong>
                {latestVisit.labResults}
              </p>
              <p>
                <strong className="text-slate-900 font-extrabold">Physician Advice: </strong>
                "{latestVisit.notes}"
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
              >
                <span>View Full Multi-Year Medical History</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onAppointmentBooked={(newApt) => {
          setAppointments(getAppointments());
        }}
      />

      {/* Patient History Modal */}
      <PatientHistoryModal
        patient={currentPatient}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </PanelLayout>
  );
}
