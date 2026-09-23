import React from "react";
import { FileText, Calendar, Pill, AlertTriangle, Activity, Stethoscope, Heart, User, CheckCircle2 } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import { getPatients } from "../../data/mockData";

export default function PatientMedicalHistory() {
  const patients = getPatients();
  const currentPatient = patients[0]; // Aditi Kapoor
  const medicalHistory = currentPatient.medicalHistory || [];

  return (
    <PanelLayout
      role="patient"
      title="My Personal Medical History & Health Records"
      subtitle="Complete, tamper-proof timeline of all your doctor consultations, clinical diagnoses, and diagnostic reports."
    >
      <div className="space-y-6">
        {/* Profile & Allergies Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-bold flex items-center justify-center text-lg">
              {currentPatient.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{currentPatient.name}</h3>
              <p className="text-xs text-slate-500">
                {currentPatient.age} yrs • {currentPatient.gender} • Blood: {currentPatient.bloodGroup || "B+"}
              </p>
            </div>
          </div>

          <div className="bg-red-50/70 p-5 rounded-3xl border border-red-100 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Allergies</span>
              <p className="text-xs text-red-700 mt-1 font-medium">
                {currentPatient.allergies?.join(", ") || "No known allergies"}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-100 flex items-start gap-3">
            <Activity className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Chronic Conditions</span>
              <p className="text-xs text-amber-700 mt-1 font-medium">
                {currentPatient.chronicConditions?.join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Chronological Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Consultation Encounters</h3>
              <p className="text-xs text-slate-500">Chronological logs of every clinical visit</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700">
              {medicalHistory.length} Consultations Recorded
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
            {medicalHistory.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-sky-600 shadow-sm" />

                <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-sky-200 hover:shadow-xs transition space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-sky-600" />
                      <span className="font-bold text-slate-900 text-sm">{item.doctorName}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        {item.specialty}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-700">Reason for visit: </span>
                    {item.reason}
                  </p>

                  <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs">
                    <span className="font-bold text-sky-950">Clinical Diagnosis: </span>
                    <span className="text-sky-900">{item.diagnosis}</span>
                  </div>

                  {item.prescriptions && item.prescriptions.length > 0 && (
                    <div className="text-xs space-y-1.5">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Pill className="w-3.5 h-3.5 text-purple-600" /> Prescribed Medications:
                      </span>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {item.prescriptions.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.labResults && (
                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-700">Laboratory Diagnostics: </span>
                      {item.labResults}
                    </p>
                  )}

                  {item.notes && (
                    <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-2">
                      Doctor Advice: "{item.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
