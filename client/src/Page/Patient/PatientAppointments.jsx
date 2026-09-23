import React, { useState } from "react";
import { Calendar, Clock, Plus, Stethoscope, MapPin, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import BookAppointmentModal from "../../components/panels/BookAppointmentModal";
import { getAppointments, getPatients, getDoctors, updateAppointmentStatus } from "../../data/mockData";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(getAppointments);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const patients = getPatients();
  const currentPatient = patients[0]; // Aditi Kapoor

  const patientAppointments = appointments.filter(
    (a) => a.patientName.toLowerCase() === currentPatient.name.toLowerCase()
  );

  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updated = updateAppointmentStatus(id, "Cancelled");
      setAppointments([...updated]);
    }
  };

  return (
    <PanelLayout
      role="patient"
      title="My Appointments & Doctor Visits"
      subtitle="Track upcoming consultations, review past visits, or book an appointment with any Medicare specialist."
    >
      <div className="space-y-6">
        {/* Header Action Strip */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Scheduled Appointments</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">
              {patientAppointments.length} Total Visits on Record
            </p>
          </div>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {patientAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-sky-200 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base">{apt.doctorName}</h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800">
                      {apt.doctorSpecialty}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        apt.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : apt.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Reason for visit: </span>
                    {apt.symptoms}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
                    </span>
                    <span className="font-semibold text-emerald-600">Fee: {apt.fee || "$75"}</span>
                  </div>
                </div>
              </div>

              {apt.status !== "Cancelled" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCancel(apt.id)}
                    className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                  >
                    Cancel Visit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {patientAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No scheduled appointments.</p>
            <p className="text-xs text-slate-400 mt-1">Book an appointment with any Medicare physician.</p>
          </div>
        )}
      </div>

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onAppointmentBooked={() => {
          setAppointments(getAppointments());
        }}
      />
    </PanelLayout>
  );
}
