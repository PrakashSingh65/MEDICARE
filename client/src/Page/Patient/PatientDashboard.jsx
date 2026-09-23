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
      title={`Hello, ${currentPatient.name}`}
      subtitle="Your personal health records, upcoming doctor visits, active medications, and wellness reminders."
    >
      <div className="space-y-8">
        {/* Welcome & Next Visit Card */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-semibold backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Medicare {currentPatient.plan} Health Plan Active
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {nextAppointment ? "Upcoming Doctor Consultation" : "Schedule Your Next Consultation"}
              </h2>
              {nextAppointment ? (
                <p className="text-sky-100 text-xs sm:text-sm">
                  You are booked with <strong className="text-white">{nextAppointment.doctorName}</strong> ({nextAppointment.doctorSpecialty}) on <strong className="text-white">{nextAppointment.date}</strong> at <strong className="text-white">{nextAppointment.time}</strong>.
                </p>
              ) : (
                <p className="text-sky-100 text-xs sm:text-sm">
                  Keep your preventive care on track. Browse available specialists and schedule a visit in minutes.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 text-sm font-bold shadow-md transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-xs transition flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>My Full Health History</span>
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Quick Health Vitals Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Blood Group</span>
              <span className="p-2 rounded-xl bg-red-50 text-red-600">
                <Heart className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{currentPatient.bloodGroup || "B+"}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Verified lab record</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Scheduled Visits</span>
              <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{patientAppointments.length} Active</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">1 confirmed upcoming</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Active Prescriptions</span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Pill className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">2 Medications</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Amlodipine, Propranolol</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold uppercase tracking-wider">Clinical Consults</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{currentPatient.totalVisits || 6} Total</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Recorded in timeline</p>
          </div>
        </div>

        {/* Appointments & Active Prescriptions Double Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">My Appointments</h3>
                    <p className="text-xs text-slate-500">Upcoming clinical visits</p>
                  </div>
                </div>
                <Link
                  to="/patient/appointments"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <span>All Visits</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {patientAppointments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No scheduled appointments.</div>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-sky-50/40 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{apt.doctorName}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{apt.doctorSpecialty} • {apt.type}</p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {apt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsBookModalOpen(true)}
              className="mt-6 w-full py-2.5 rounded-xl border border-dashed border-sky-300 bg-sky-50/50 hover:bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Book Another Doctor Consultation</span>
            </button>
          </div>

          {/* Active Medications & Refills */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Active Medications</h3>
                    <p className="text-xs text-slate-500">Current treatment protocol</p>
                  </div>
                </div>
                <Link
                  to="/patient/prescriptions"
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>View All Meds</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Amlodipine 5mg</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Ongoing
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Dosage: 1 Tablet • Every morning after breakfast</p>
                  <p className="text-[11px] text-slate-400">Prescribed by Dr. Priya Sharma for BP control</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Propranolol 10mg</span>
                    <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                      As Needed (SOS)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Dosage: 1 Tablet • During acute stress or palpitations</p>
                  <p className="text-[11px] text-slate-400">Prescribed by Dr. Priya Sharma</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Delivery by Medicare Express Pharmacy</span>
              <Link to="/patient/prescriptions" className="font-semibold text-purple-600 hover:underline">
                Order Refill
              </Link>
            </div>
          </div>
        </div>

        {/* Latest Clinical Note Timeline Banner */}
        {latestVisit && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs uppercase font-bold text-sky-600">Most Recent Consultation Summary</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Visit with {latestVisit.doctorName} ({latestVisit.specialty})
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{latestVisit.date}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
              <p>
                <span className="font-bold text-slate-900">Diagnosis: </span>
                {latestVisit.diagnosis}
              </p>
              <p>
                <span className="font-bold text-slate-900">Lab Diagnostic Result: </span>
                {latestVisit.labResults}
              </p>
              <p>
                <span className="font-bold text-slate-900">Doctor Advice: </span>
                "{latestVisit.notes}"
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>View Full Multi-Year Medical History</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
