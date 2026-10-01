import React, { useState } from "react";
import { X, Calendar, Clock, Stethoscope, Video, Phone, Building, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { getAvailableDoctors, bookPatientAppointment } from "../../data/patientMockData";

export default function PatientBookModal({
  isOpen,
  onClose,
  preselectedDoctor = null,
  preselectedSlot = null,
  onSuccess
}) {
  const doctors = getAvailableDoctors();
  const initialDoctor = preselectedDoctor || doctors[0];

  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctor?.id || "");
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [time, setTime] = useState(preselectedSlot || initialDoctor?.availableSlots?.[0] || "10:00 AM");
  const [type, setType] = useState("Video Consultation");
  const [symptoms, setSymptoms] = useState("");
  const [enableReminder, setEnableReminder] = useState(true);
  const [error, setError] = useState("");
  const [bookedSuccess, setBookedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const activeSlots = currentDoctor?.availableSlots || [
    "09:00 AM",
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "03:30 PM",
    "04:30 PM"
  ];

  const handleDoctorChange = (id) => {
    setSelectedDoctorId(id);
    const doc = doctors.find((d) => d.id === id);
    if (doc?.availableSlots?.length) {
      setTime(doc.availableSlots[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      setError("Please choose a valid consultation date.");
      return;
    }
    if (!time) {
      setError("Please select a time slot.");
      return;
    }
    if (!symptoms.trim()) {
      setError("Please provide a brief reason or symptoms for the consultation.");
      return;
    }

    setError("");
    const newAppointment = bookPatientAppointment({
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.specialty,
      doctorAvatar: currentDoctor.avatar,
      date,
      time,
      type,
      symptoms: symptoms.trim(),
      fee: currentDoctor.fee,
      reminderEnabled: enableReminder,
      clinic: currentDoctor.clinic
    });

    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      if (onSuccess) onSuccess(newAppointment);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-6 bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Calendar className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Book Doctor Consultation</h3>
              <p className="text-xs text-sky-200 font-medium">Schedule instantly with verified Medicare specialists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookedSuccess ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Appointment Booked!</h3>
            <p className="text-xs text-slate-600">
              Your appointment with {currentDoctor.name} has been confirmed for {date} at {time}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Select Medical Specialist
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty} (${doc.fee})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentDoctor.avatar}
                  alt={currentDoctor.name}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{currentDoctor.name}</h4>
                  <p className="text-[11px] text-slate-500">{currentDoctor.clinic}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee</span>
                <span className="text-sm font-black text-emerald-600">${currentDoctor.fee}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-2">
                Consultation Format
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "Video Consultation", label: "Video Call", icon: Video },
                  { id: "Audio Consultation", label: "Voice Call", icon: Phone },
                  { id: "In-Clinic Visit", label: "In-Clinic", icon: Building }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = type === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setType(mode.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        isSelected
                          ? "bg-sky-50 border-sky-600 text-sky-900 shadow-xs ring-1 ring-sky-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-sky-600" : "text-slate-400"}`} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Consultation Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Available Slots
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {activeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                Reason for Visit / Symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={3}
                placeholder="Briefly describe your symptoms, discomfort, or concerns..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
              <input
                id="reminderCheckbox"
                type="checkbox"
                checked={enableReminder}
                onChange={(e) => setEnableReminder(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <label htmlFor="reminderCheckbox" className="text-xs text-slate-700 cursor-pointer">
                <span className="font-bold text-slate-900 block">Enable Automated Reminders</span>
                Receive SMS and push notification alerts 24h & 1h prior to appointment.
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-sm transition"
              >
                Confirm & Schedule (${currentDoctor.fee})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
