import React, { useState } from "react";
import { X, CalendarX, AlertCircle, AlertTriangle } from "lucide-react";

export default function CancelAppointmentModal({ appointment, isOpen, onClose, onCancelConfirm }) {
  const [cancelReason, setCancelReason] = useState("");

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    onCancelConfirm(appointment.id, cancelReason);
    setCancelReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 bg-gradient-to-r from-red-800 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <CalendarX className="w-5 h-5 text-red-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Cancel Appointment</h3>
              <p className="text-xs text-red-200 font-medium">#{appointment.appointmentNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <p>
              Cancelling will release the consultation slot, alert both patient and doctor via SMS/Email, and initiate an automatic refund if eligible.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <p><strong className="text-slate-900">Patient:</strong> {appointment.patientName}</p>
            <p><strong className="text-slate-900">Doctor:</strong> {appointment.doctorName}</p>
            <p><strong className="text-slate-900">Scheduled:</strong> {appointment.date} at {appointment.time}</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Cancellation Reason:
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
              rows={3}
              placeholder="e.g., Doctor emergency unavailable / patient requested change..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CalendarX className="w-4 h-4" />
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
