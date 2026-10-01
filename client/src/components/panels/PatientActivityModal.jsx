import React from "react";
import { X, Activity, User, ShieldAlert, ShieldCheck, Calendar, CreditCard, FileText, LogIn, MapPin, Phone, Mail } from "lucide-react";

export default function PatientActivityModal({ patient, isOpen, onClose, onToggleStatus }) {
  if (!isOpen || !patient) return null;

  const logs = patient.activityLog || [];

  const getActivityIcon = (type) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "prescription":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "login":
        return <LogIn className="w-4 h-4 text-indigo-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Activity className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Patient Account Activity</h3>
              <p className="text-xs text-purple-200 font-medium">Security logs, logins, appointments & transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3.5">
              {patient.avatar ? (
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                  {patient.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-base">{patient.name}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      patient.status === "Active"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {patient.email} • {patient.phone}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>Plan: <strong className="text-purple-700">{patient.plan}</strong></span>
                  <span>•</span>
                  <span>Blood: <strong className="text-emerald-700">{patient.bloodGroup || "O+"}</strong></span>
                  <span>•</span>
                  <span>{patient.totalVisits || 0} Visits</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onToggleStatus(patient.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border shadow-2xs ${
                patient.status === "Active"
                  ? "bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border-red-200"
                  : "bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border-emerald-200"
              }`}
            >
              {patient.status === "Active" ? (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Deactivate Account</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Activate Account</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h5 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              Chronological Audit Trail & Activity
            </h5>

            {logs.length > 0 ? (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-200 transition flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getActivityIcon(log.type)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{log.title}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{log.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>IP: {log.ip || "103.21.244.1"}</span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No recorded activity events for this patient yet.
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
