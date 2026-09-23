import React, { useState } from "react";
import { Pill, Clock, CheckCircle, RefreshCw, AlertCircle, Calendar, ShieldCheck, Stethoscope } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import { getPatients, getMedicines } from "../../data/mockData";

export default function PatientPrescriptions() {
  const patients = getPatients();
  const currentPatient = patients[0]; // Aditi Kapoor
  const [refillStatus, setRefillStatus] = useState({});

  const activePrescriptions = [
    {
      id: "rx-1",
      name: "Amlodipine 5mg",
      salt: "Amlodipine Besylate",
      doctorName: "Dr. Priya Sharma",
      specialty: "Cardiology",
      schedule: "1 Tablet Daily • Morning (After breakfast)",
      indication: "Blood pressure management & hypertension control",
      remainingDays: 14,
      startDate: "2026-03-15",
      refillsLeft: 3,
      instructions: "Take with a glass of water. Maintain a low-sodium diet and monitor BP weekly.",
    },
    {
      id: "rx-2",
      name: "Propranolol 10mg",
      salt: "Propranolol Hydrochloride",
      doctorName: "Dr. Priya Sharma",
      specialty: "Cardiology",
      schedule: "1 Tablet As Needed (SOS) • During high anxiety or palpitations",
      indication: "Heart rate regulation and palpitations relief",
      remainingDays: 28,
      startDate: "2026-03-15",
      refillsLeft: 2,
      instructions: "Do not exceed 2 tablets in 24 hours without consulting cardiologist.",
    },
    {
      id: "rx-3",
      name: "Vitamin D3 60,000 IU",
      salt: "Cholecalciferol",
      doctorName: "Dr. Ankit Verma",
      specialty: "General Medicine",
      schedule: "1 Capsule Weekly • Every Sunday morning with milk",
      indication: "Vitamin D deficiency recovery",
      remainingDays: 21,
      startDate: "2026-03-01",
      refillsLeft: 1,
      instructions: "Take with dietary fats or milk for enhanced absorption.",
    },
  ];

  const handleRequestRefill = (id) => {
    setRefillStatus((prev) => ({ ...prev, [id]: "Refill Requested! Pharmacy notified." }));
    setTimeout(() => {
      setRefillStatus((prev) => ({ ...prev, [id]: "Dispatched by Medicare Pharmacy" }));
    }, 2000);
  };

  return (
    <PanelLayout
      role="patient"
      title="My Active Prescriptions & Medications"
      subtitle="View your prescribed medications, daily intake schedules, dosing instructions, and order pharmacy refills."
    >
      <div className="space-y-6">
        {/* Prescription Overview Banner */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {activePrescriptions.length} Active Prescribed Medications
              </h2>
              <p className="text-xs text-slate-500">
                All medications verified by Medicare Licensed Specialists
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Adherence: 95% on schedule
          </span>
        </div>

        {/* Prescription Cards */}
        <div className="space-y-4">
          {activePrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-purple-200 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{rx.name}</h3>
                      <span className="text-xs text-slate-400">({rx.salt})</span>
                    </div>
                    <p className="text-xs text-purple-700 font-semibold mt-0.5">{rx.schedule}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                      <span>Prescribed by {rx.doctorName} ({rx.specialty})</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {rx.remainingDays} days supply left
                  </span>
                  <button
                    onClick={() => handleRequestRefill(rx.id)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Request Pharmacy Refill</span>
                  </button>
                  {refillStatus[rx.id] && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                      <CheckCircle className="w-3 h-3" />
                      {refillStatus[rx.id]}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-800">Indication: </strong>
                  {rx.indication}
                </p>
                <p>
                  <strong className="text-slate-800">Clinical Instructions: </strong>
                  {rx.instructions}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>Prescription Start: {rx.startDate}</span>
                  <span>Refills Remaining: {rx.refillsLeft} refills</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelLayout>
  );
}
