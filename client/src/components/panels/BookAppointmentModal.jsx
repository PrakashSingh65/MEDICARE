import React, { useState } from "react";
import { X, Calendar, Clock, Stethoscope, CheckCircle, AlertCircle } from "lucide-react";
import { getDoctors, addAppointment } from "../../data/mockData";

export default function BookAppointmentModal({ isOpen, onClose, onAppointmentBooked, defaultDoctorId = null }) {
  const doctors = getDoctors();
  const [formData, setFormData] = useState({
    doctorId: defaultDoctorId || (doctors[0]?.id || ""),
    patientName: "Aditi Kapoor",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "10:30 AM",
    type: "General Consultation",
    symptoms: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find((d) => d.id === formData.doctorId) || doctors[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date || !formData.symptoms) {
      setError("Please fill out Patient Name, Date, and Symptoms.");
      return;
    }

    const newApt = addAppointment({
      ...formData,
      doctorName: selectedDoctor?.name || "Dr. Priya Sharma",
      doctorSpecialty: selectedDoctor?.specialty || "General Medicine",
      fee: selectedDoctor?.fee || "$50",
    });

    if (onAppointmentBooked) onAppointmentBooked(newApt);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 900);
  };

  const timeslots = [
    "09:00 AM",
    "09:45 AM",
    "10:30 AM",
    "11:15 AM",
    "02:00 PM",
    "02:45 PM",
    "03:30 PM",
    "04:15 PM",
    "05:00 PM",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Book Appointment</h2>
              <p className="text-xs text-slate-500">Schedule consultation with a specialist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-sm text-slate-700">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Appointment successfully booked!</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Select Doctor *</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialty} ({d.fee || "$50"})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Patient Full Name *</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="e.g. Aditi Kapoor"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Preferred Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Time Slot *</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
              >
                {timeslots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Consultation Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
            >
              <option value="General Consultation">General Consultation</option>
              <option value="Follow-up Consultation">Follow-up Consultation</option>
              <option value="Routine Health Checkup">Routine Health Checkup</option>
              <option value="Specialist Second Opinion">Specialist Second Opinion</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Symptoms / Reason for Visit *
            </label>
            <textarea
              rows={2}
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="Describe symptoms, discomfort duration, or medical questions..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
