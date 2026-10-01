import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Eye,
  FileText,
  Activity,
  AlertTriangle,
  Pill,
  FolderOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  HeartPulse,
  X,
  Stethoscope,
  Plus,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import { getDoctorPatients } from "../../data/doctorMockData";

export default function DoctorPatients() {
  const [patients] = useState(getDoctorPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [activeTab, setActiveTab] = useState("overview");

  const filteredPatients = patients.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.medicalHistory && p.medicalHistory.some((m) => m.condition.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  });

  return (
    <PanelLayout
      role="doctor"
      title="Patient Management & Clinical Charts"
      subtitle="Examine your patient roster, medical histories, previous consultation encounters, previous prescriptions, uploaded diagnostic reports, allergies, and active medications."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4 flex flex-col max-h-[850px]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Patient Roster</h3>
                <p className="text-xs text-slate-400">{filteredPatients.length} active patient files</p>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or condition..."
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {filteredPatients.map((patient) => {
                const isSelected = selectedPatient?.id === patient.id;
                return (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setActiveTab("overview");
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-emerald-50/90 border-emerald-500 shadow-xs"
                        : "bg-slate-50/60 border-slate-200 hover:bg-white hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-white shadow-xs"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs leading-snug">{patient.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {patient.age}y, {patient.gender} • Blood {patient.bloodGroup}
                        </p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          {patient.medicalHistory?.[0]?.condition || "Routine Checkup"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      {patient.plan}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {selectedPatient ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedPatient.avatar}
                      alt={selectedPatient.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-lg">{selectedPatient.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {selectedPatient.plan} Plan
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {selectedPatient.age} years old, {selectedPatient.gender} • Blood Group: <strong className="text-emerald-700">{selectedPatient.bloodGroup}</strong>
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{selectedPatient.city}</span>
                        <span>•</span>
                        <span>Ph: {selectedPatient.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/doctor/consultation"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      Consult Patient
                    </Link>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === "overview" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Clinical Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === "history" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Medical History ({selectedPatient.medicalHistory?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("consultations")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === "consultations" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Previous Consults ({selectedPatient.previousConsultations?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("prescriptions")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === "prescriptions" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Prescriptions ({selectedPatient.previousPrescriptions?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === "reports" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    Reports ({selectedPatient.uploadedReports?.length || 0})
                  </button>
                </div>

                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                        Known Allergies & Sensitivities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies?.map((allergy, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                              allergy === "None"
                                ? "bg-slate-100 text-slate-600 border-slate-200"
                                : "bg-red-50 text-red-800 border-red-200"
                            }`}
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-purple-600" />
                        Current Active Medications
                      </h4>
                      <div className="space-y-2">
                        {selectedPatient.currentMedications?.map((med, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <p className="font-extrabold text-slate-900">{med.name} ({med.dosage})</p>
                              <p className="text-slate-500 mt-0.5">{med.instructions}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-mono font-bold text-purple-700">{med.frequency}</span>
                              <span className="block text-[11px] text-slate-400 font-medium">{med.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-3">
                    {selectedPatient.medicalHistory?.map((hist, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm leading-snug">{hist.condition}</p>
                          <p className="text-slate-500 mt-0.5">Diagnosed on: {hist.diagnosedDate}</p>
                        </div>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {hist.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "consultations" && (
                  <div className="space-y-3">
                    {selectedPatient.previousConsultations?.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">{c.date} • {c.doctor}</span>
                          <span className="font-black text-emerald-600">${c.fee}</span>
                        </div>
                        <p className="font-bold text-purple-700">Diagnosis: {c.diagnosis}</p>
                        <p className="text-slate-600">Treatment Plan: {c.treatment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "prescriptions" && (
                  <div className="space-y-3">
                    {selectedPatient.previousPrescriptions?.map((rx) => (
                      <div
                        key={rx.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">Prescription #{rx.id}</p>
                          <p className="text-slate-500 mt-0.5">Issued: {rx.date} • {rx.medicinesCount} medications</p>
                          <p className="text-purple-700 font-medium mt-1">{rx.summary}</p>
                        </div>
                        <Link
                          to="/doctor/prescriptions"
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100"
                        >
                          View Rx
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reports" && (
                  <div className="space-y-3">
                    {selectedPatient.uploadedReports?.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-extrabold text-slate-900">{rep.title}</p>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{rep.size}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Date: {rep.date} • Format: {rep.fileType}</p>
                        {rep.interpretation && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs mt-1">
                            <strong className="text-emerald-900">Interpretation:</strong> {rep.interpretation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-xs text-slate-400">
                Select a patient from the roster to inspect charts.
              </div>
            )}
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
