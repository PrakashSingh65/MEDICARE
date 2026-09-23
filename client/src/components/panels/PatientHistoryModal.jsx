import React from "react";
import { X, Calendar, User, FileText, AlertTriangle, Activity, Pill, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export default function PatientHistoryModal({ patient, isOpen, onClose }) {
  if (!isOpen || !patient) return null;

  const medicalHistory = patient.medicalHistory || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {patient.name?.charAt(0) || "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {patient.plan || "Standard"} Plan
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {patient.status || "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                <span>{patient.age} yrs • {patient.gender || "Patient"}</span>
                <span className="font-semibold text-emerald-700">Blood: {patient.bloodGroup || "O+"}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {patient.city || "India"}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Clinical Alerts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-red-50/70 p-3.5 rounded-2xl border border-red-100 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">Known Allergies</span>
                <p className="text-xs text-red-700 mt-0.5 font-medium">
                  {patient.allergies?.length > 0 ? patient.allergies.join(", ") : "No known medication allergies"}
                </p>
              </div>
            </div>
            <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 flex items-start gap-3">
              <Activity className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Chronic Conditions</span>
                <p className="text-xs text-amber-700 mt-0.5 font-medium">
                  {patient.chronicConditions?.length > 0 ? patient.chronicConditions.join(", ") : "None reported"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {patient.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {patient.phone || "+91 98000 00000"}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since: {patient.joined || "2024"}</span>
          </div>

          {/* Medical History Timeline */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Complete Patient Medical History & Consultations</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {medicalHistory.length} Logged Consultations
              </span>
            </div>

            {medicalHistory.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">No past medical consultations recorded yet.</p>
                <p className="text-xs text-slate-400 mt-1">Prescriptions and doctor encounters will populate here.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
                {medicalHistory.map((record, idx) => (
                  <div key={record.id || idx} className="relative group">
                    {/* Timeline bullet */}
                    <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-emerald-600 shadow-sm" />
                    
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{record.doctorName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                            {record.specialty}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {record.date}
                        </span>
                      </div>

                      {record.reason && (
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Chief Complaint:</span> {record.reason}
                        </p>
                      )}

                      <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/60 text-xs">
                        <span className="font-bold text-emerald-900">Diagnosis: </span>
                        <span className="text-emerald-800">{record.diagnosis}</span>
                      </div>

                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div className="text-xs space-y-1">
                          <span className="font-semibold text-slate-700 flex items-center gap-1">
                            <Pill className="w-3 h-3 text-sky-600" /> Prescribed Medications:
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {record.prescriptions.map((med, mIdx) => (
                              <span
                                key={mIdx}
                                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                              >
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.labResults && (
                        <p className="text-xs text-slate-500">
                          <span className="font-medium text-slate-700">Lab Diagnostic findings: </span>
                          {record.labResults}
                        </p>
                      )}

                      {record.notes && (
                        <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-1.5">
                          Doctor note: "{record.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 text-sm transition"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
}
