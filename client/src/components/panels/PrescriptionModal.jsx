import React, { useState } from "react";
import { X, Pill, Plus, Trash2, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { getMedicines, addPatientMedicalRecord } from "../../data/mockData";

export default function PrescriptionModal({ isOpen, onClose, patient, doctorName = "Dr. Priya Sharma", doctorSpecialty = "Cardiology", onPrescriptionSaved }) {
  const medicines = getMedicines();
  const [diagnosis, setDiagnosis] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [labResults, setLabResults] = useState("");
  const [prescribedList, setPrescribedList] = useState([
    { medicineName: medicines[0]?.name || "Paracetamol 650mg", dosage: "1 Tablet", frequency: "Twice daily after food", duration: "5 days" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen || !patient) return null;

  const handleAddRow = () => {
    setPrescribedList((prev) => [
      ...prev,
      { medicineName: medicines[0]?.name || "Paracetamol 650mg", dosage: "1 Tablet", frequency: "Once daily", duration: "7 days" },
    ]);
  };

  const handleRemoveRow = (index) => {
    setPrescribedList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    setPrescribedList((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError("Please provide a clinical diagnosis.");
      return;
    }

    const prescriptionStrings = prescribedList.map(
      (p) => `${p.medicineName} (${p.dosage}) - ${p.frequency} for ${p.duration}`
    );

    const record = {
      doctorName,
      specialty: doctorSpecialty,
      reason: "Consultation & clinical review",
      diagnosis,
      prescriptions: prescriptionStrings,
      labResults: labResults || "Vitals within normal limits",
      notes: clinicalNotes,
    };

    addPatientMedicalRecord(patient.id, record);

    if (onPrescriptionSaved) onPrescriptionSaved(record);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Write Prescription & Diagnosis</h2>
              <p className="text-xs text-slate-500">Patient: {patient.name} ({patient.age}y, {patient.bloodGroup || "O+"})</p>
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
              <span>Prescription and health record updated successfully!</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Clinical Diagnosis *</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Bronchitis / Stage 1 Hypertension"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              required
            />
          </div>

          {/* Prescribed Medicines Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prescribe Medicines (From Medicare Catalog)</span>
              </label>
              <button
                type="button"
                onClick={handleAddRow}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-2">
              {prescribedList.map((row, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Medicine #{idx + 1}</span>
                    {prescribedList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(idx)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={row.medicineName}
                      onChange={(e) => handleRowChange(idx, "medicineName", e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      {medicines.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.category})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={row.dosage}
                      onChange={(e) => handleRowChange(idx, "dosage", e.target.value)}
                      placeholder="Dosage (e.g. 1 Tab / 5ml)"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={row.frequency}
                      onChange={(e) => handleRowChange(idx, "frequency", e.target.value)}
                      placeholder="Frequency (e.g. Twice daily after meals)"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={row.duration}
                      onChange={(e) => handleRowChange(idx, "duration", e.target.value)}
                      placeholder="Duration (e.g. 7 days / 1 month)"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Lab Diagnostic & Test Findings</label>
            <input
              type="text"
              value={labResults}
              onChange={(e) => setLabResults(e.target.value)}
              placeholder="e.g. Blood sugar fasting: 110 mg/dL, ECG: Normal sinus rhythm"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Doctor Advice & Follow-up Instructions</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Dietary precautions, hydration advice, follow-up timeline in 2 weeks..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Issue Prescription</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
