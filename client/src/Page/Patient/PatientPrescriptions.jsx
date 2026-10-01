import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pill,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Download,
  Printer,
  Eye,
  Search,
  Sparkles,
  Heart
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PrescriptionPreviewModal from "../../components/panels/PrescriptionPreviewModal";
import { getPatientPrescriptions } from "../../data/patientMockData";

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState(getPatientPrescriptions);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedPrescriptionForPreview, setSelectedPrescriptionForPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [refillNotice, setRefillNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activePrescriptions = prescriptions.filter((rx) => rx.status === "Active");
  const pastPrescriptions = prescriptions.filter((rx) => rx.status !== "Active");

  const displayedPrescriptions = (activeTab === "active" ? activePrescriptions : pastPrescriptions).filter((rx) => {
    const matchesSearch =
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.medicines?.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleOpenPreview = (rx) => {
    setSelectedPrescriptionForPreview({
      ...rx,
      patientName: "Aditi Kapoor",
      patientAge: 29,
      patientGender: "Female",
      patientId: "pat-1",
      prescriptionNumber: rx.rxNumber,
      date: rx.date,
      medicines: rx.medicines?.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions
      })),
      notes: rx.generalAdvice,
      followUp: rx.followUp
    });
    setIsPreviewOpen(true);
  };

  const handleRequestRefill = (rxNumber, medName) => {
    setRefillNotice(`Refill requested for ${medName} (${rxNumber}). Sent to pharmacy for instant dispatch.`);
    setTimeout(() => {
      setRefillNotice("");
    }, 4000);
  };

  return (
    <PanelLayout
      role="patient"
      title="Prescriptions & Medication Management"
      subtitle="Review active dosages, dosing frequencies, course durations, doctor clinical directives, and download official PDF prescriptions."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {refillNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{refillNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Regimens</p>
              <h3 className="text-xl font-black text-slate-900">{activePrescriptions.length} Prescriptions</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Refill</p>
              <h3 className="text-xl font-black text-slate-900">April 24, 2026</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">E-Signed Copies</p>
              <h3 className="text-xl font-black text-slate-900">{prescriptions.length} Archived</h3>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "active"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Active Prescriptions</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800">
              {activePrescriptions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "history"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Prescription History</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {pastPrescriptions.length}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by doctor, medication name, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-6">
          {displayedPrescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              No prescriptions found matching your selection.
            </div>
          ) : (
            displayedPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-sky-300 transition space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-black text-base shrink-0">
                      Rx
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-base">{rx.doctorName}</h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800">
                          {rx.doctorSpecialty}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            rx.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rx.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Prescription #{rx.rxNumber} • Issued: {rx.date} • {rx.clinic}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <button
                      onClick={() => handleOpenPreview(rx)}
                      className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => handleOpenPreview(rx)}
                      className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-slate-900 font-bold block mb-0.5">Clinical Diagnosis:</strong>
                  <span className="text-slate-700 font-semibold">{rx.diagnosis}</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                    Prescribed Medicines & Posology
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3 rounded-l-xl">Medicine Name</th>
                          <th className="py-2.5 px-3">Dosage</th>
                          <th className="py-2.5 px-3">Frequency</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Special Instructions</th>
                          <th className="py-2.5 px-3 text-right rounded-r-xl">Refills</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {rx.medicines?.map((med, mIdx) => (
                          <tr key={mIdx} className="hover:bg-slate-50/60 transition">
                            <td className="py-3 px-3">
                              <span className="font-extrabold text-slate-900 block">{med.name}</span>
                            </td>
                            <td className="py-3 px-3 font-bold text-sky-800">{med.dosage}</td>
                            <td className="py-3 px-3 text-slate-700">{med.frequency}</td>
                            <td className="py-3 px-3 font-semibold text-slate-800">{med.duration}</td>
                            <td className="py-3 px-3 text-slate-600 max-w-xs">{med.instructions}</td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleRequestRefill(rx.rxNumber, med.name)}
                                className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold border border-sky-100 transition"
                              >
                                {med.refills} left (Refill)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-amber-900">
                    <strong className="block font-bold mb-1">Doctor's Dietary & Lifestyle Advice</strong>
                    <p className="leading-relaxed">{rx.generalAdvice}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 text-sky-900 flex flex-col justify-between">
                    <div>
                      <strong className="block font-bold mb-1">Follow-up Consultation</strong>
                      <p>{rx.followUp}</p>
                    </div>
                    {rx.nextRefillDue && (
                      <p className="text-[11px] font-bold text-sky-700 pt-2">
                        Next Suggested Refill: {rx.nextRefillDue}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <PrescriptionPreviewModal
        prescription={selectedPrescriptionForPreview}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </PanelLayout>
  );
}
