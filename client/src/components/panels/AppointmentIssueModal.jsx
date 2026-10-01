import React, { useState } from "react";
import { X, AlertTriangle, CheckCircle2, Clock, User, Calendar, MessageSquare, ShieldCheck } from "lucide-react";

export default function AppointmentIssueModal({ appointment, isOpen, onClose, onResolve }) {
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!isOpen || !appointment) return null;

  const issue = appointment.issue;

  const handleResolve = (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;
    onResolve(appointment.id, resolutionNotes);
    setResolutionNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-amber-700 via-orange-800 to-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Resolve Appointment Issue</h3>
              <p className="text-xs text-amber-200 font-medium">Ticket #{issue?.id || "ISSUE"} • {appointment.appointmentNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleResolve} className="p-6 overflow-y-auto space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Issue Category: {issue?.type || "General Clinical Escalation"}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {issue?.status || "Open"}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              {issue?.description || "Patient reported conflict or delays regarding this clinical appointment."}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-amber-800 font-medium pt-1 border-t border-amber-200/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Reported: {issue?.reportedAt || "Recent"}
              </span>
              <span>•</span>
              <span>By: {issue?.reportedBy || "Support Coordinator"}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Patient:</span>
              <span className="font-bold text-slate-800">{appointment.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Specialist:</span>
              <span className="font-bold text-slate-800">{appointment.doctorName} ({appointment.specialty})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Schedule:</span>
              <span className="font-bold text-slate-800">{appointment.date} at {appointment.time}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
              Administrative Resolution Notes & Actions Taken:
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              required
              rows={4}
              placeholder="e.g., Doctor reassigned / patient notified via SMS / emergency credit voucher issued..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Resolved & Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
