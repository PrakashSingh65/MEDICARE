import React, { useState, useEffect } from "react";
import { X, FileText, CheckCircle2, Save, MessageSquare } from "lucide-react";

export default function ReportInterpretationModal({ report, isOpen, onClose, onSave }) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (report) {
      setNotes(report.interpretationNotes || "");
    }
  }, [report]);

  if (!isOpen || !report) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(report.id, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <FileText className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Clinical Report Interpretation</h3>
              <p className="text-xs text-emerald-200 font-medium">Add diagnostic notes & recommendations</p>
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
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <p><strong className="text-slate-900">Report:</strong> {report.reportTitle}</p>
            <p><strong className="text-slate-900">Patient:</strong> {report.patientName}</p>
            <p><strong className="text-slate-900">Category:</strong> {report.reportType} • {report.date}</p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Doctor Diagnostic Impression & Notes:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              rows={4}
              placeholder="Record diagnostic findings, hemodynamic values, risk profile, and recommended treatment modifications..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <Save className="w-4 h-4" />
              Save Interpretation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
