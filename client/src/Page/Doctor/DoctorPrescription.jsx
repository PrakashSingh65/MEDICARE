import React, { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Trash2,
  Printer,
  FileText,
  Save,
  CheckCircle2,
  Calendar,
  User,
  Eye,
  Sparkles,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PrescriptionPreviewModal from "../../components/panels/PrescriptionPreviewModal";
import {
  getDoctorPatients,
  getDoctorPrescriptions,
  saveDoctorPrescription,
  syncDoctorPrescriptions,
} from "../../data/doctorMockData";

export default function DoctorPrescription() {
  const patients = getDoctorPatients();
  const [prescriptions, setPrescriptions] = useState(getDoctorPrescriptions);
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    syncDoctorPrescriptions().then((data) => {
      if (data && Array.isArray(data)) {
        setPrescriptions(data);
      }
    });
  }, []);

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "pat-1");
  const [diagnosis, setDiagnosis] = useState("Stage 1 Essential Hypertension with mild autonomic anxiety");
  const [generalAdvice, setGeneralAdvice] = useState("Reduce dietary sodium (<2g/day). Avoid late-evening caffeine. Daily light cardio exercise.");
  const [followUpDate, setFollowUpDate] = useState("2026-10-30");

  const [medicines, setMedicines] = useState([
    { id: "med-1", name: "Amlodipine Besylate", dosage: "5mg", frequency: "1-0-0 (Morning)", duration: "30 Days", instructions: "Take after breakfast with water" },
    { id: "med-2", name: "Telmisartan", dosage: "40mg", frequency: "0-0-1 (Night)", duration: "30 Days", instructions: "Take before bedtime" },
  ]);

  const [previewPrescription, setPreviewPrescription] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleAddMedicineRow = () => {
    const newMed = {
      id: `med-${Date.now()}`,
      name: "",
      dosage: "500mg",
      frequency: "1-0-1",
      duration: "5 Days",
      instructions: "After meals with water",
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicineRow = (id) => {
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleMedicineChange = (id, field, value) => {
    const updated = medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    setMedicines(updated);
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    const prescriptionObj = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      doctorName: "Dr. Priya Sharma",
      doctorSpecialty: "Cardiology",
      diagnosis,
      medicines,
      generalAdvice,
      followUpDate,
    };
    const created = saveDoctorPrescription(prescriptionObj);
    setPrescriptions([created, ...prescriptions]);
    setSaveSuccess(true);
    setPreviewPrescription(created);
    setIsPreviewOpen(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleOpenExistingPreview = (rx) => {
    setPreviewPrescription(rx);
    setIsPreviewOpen(true);
  };

  return (
    <PanelLayout
      role="doctor"
      title="Electronic Prescriptions (e-Rx)"
      subtitle="Issue digital prescriptions, add multiple therapeutic medicines with precise dosage, frequency, and duration, and generate printable PDF slips."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "create"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Prescription</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Prescription History ({prescriptions.length})</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prescription created, recorded in patient file, and ready to print!</span>
          </div>
        )}

        {activeTab === "create" && (
          <form onSubmit={handleSavePrescription} className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                Patient & Diagnosis Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Patient</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.age}y, {p.gender})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                    placeholder="e.g. Essential Hypertension, Bronchitis"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Medications Ledger</h3>
                  <p className="text-xs text-slate-400">Add drug formulations, dosage, frequency, and intake schedule</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-extrabold transition flex items-center gap-1.5 border border-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, index) => (
                  <div
                    key={med.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-800">
                        Medicine #{index + 1}
                      </span>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(med.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Medicine Name & Generic</label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(med.id, "name", e.target.value)}
                          required
                          placeholder="e.g. Amlodipine 5mg, Paracetamol 650mg"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(med.id, "dosage", e.target.value)}
                          placeholder="e.g. 500mg, 1 tab, 10ml"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Frequency</label>
                        <select
                          value={med.frequency}
                          onChange={(e) => handleMedicineChange(med.id, "frequency", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                          <option value="0-1-0 (Noon)">0-1-0 (Noon)</option>
                          <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                          <option value="1-0-1 (Twice a day)">1-0-1 (Twice a day)</option>
                          <option value="1-1-1 (Thrice a day)">1-1-1 (Thrice a day)</option>
                          <option value="SOS (As needed)">SOS (As needed)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration</label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(med.id, "duration", e.target.value)}
                          placeholder="e.g. 5 Days, 1 Month"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="lg:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Special Instructions</label>
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => handleMedicineChange(med.id, "instructions", e.target.value)}
                          placeholder="e.g. Take after breakfast with a full glass of warm water"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                General Advice & Instructions
              </h3>
              <textarea
                value={generalAdvice}
                onChange={(e) => setGeneralAdvice(e.target.value)}
                rows={3}
                placeholder="Dietary limits, exercise, hydration guidelines, and warning signs..."
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Issue & Preview Prescription</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-mono font-black text-purple-700">
                          {rx.prescriptionNumber || rx.id}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug mt-0.5">
                          {rx.patientName}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          {rx.patientAge}y, {rx.patientGender} • Date: {rx.date}
                        </p>
                      </div>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {rx.medicines?.length || 0} Meds
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <p><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                      <p className="text-slate-500 truncate">
                        <strong>Meds:</strong> {rx.medicines?.map((m) => m.name).join(", ")}
                      </p>
                      <p className="text-purple-700 font-semibold">
                        Follow-up: {rx.followUpDate || "Routine"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenExistingPreview(rx)}
                      className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Generate PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PrescriptionPreviewModal
        prescription={previewPrescription}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </PanelLayout>
  );
}
