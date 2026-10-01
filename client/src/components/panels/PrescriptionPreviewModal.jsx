import React from "react";
import { X, Printer, Download, Pill, Activity, ShieldCheck } from "lucide-react";

export default function PrescriptionPreviewModal({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm">Official Electronic Prescription Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-white text-slate-800 font-sans print:p-0">
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-emerald-600 pb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  Rx
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  {prescription.doctorName || "Dr. Priya Sharma"}
                </h2>
              </div>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">
                {prescription.doctorSpecialty || "Cardiology & Vascular Interventions"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">MBBS, MD, DM (Cardiology), FACC</p>
              <p className="text-[10px] text-slate-400 font-mono">Reg No: MCI-2014-98432-KA</p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
              <p className="font-extrabold text-slate-900 text-sm">HeartCare Super Specialty Clinic</p>
              <p>Indiranagar, Bangalore - 560038</p>
              <p>Ph: +91 98765 43210</p>
              <p className="font-mono text-purple-700 font-bold pt-1">
                {prescription.prescriptionNumber || "RX-MED-84920"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Name</span>
              <span className="font-black text-slate-900">{prescription.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age / Gender</span>
              <span className="font-bold text-slate-900">{prescription.patientAge}y, {prescription.patientGender}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date Prescribed</span>
              <span className="font-bold text-slate-900">{prescription.date}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valid Until</span>
              <span className="font-bold text-emerald-700">90 Days</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Diagnosis:</span>
            <p className="text-xs font-black text-slate-900 mt-0.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
              {prescription.diagnosis}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-serif italic font-black text-emerald-800 text-xl">Rx</span>
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Prescribed Medications
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-600 font-extrabold">
                  <tr>
                    <th className="px-4 py-2.5">#</th>
                    <th className="px-4 py-2.5">Medicine Name</th>
                    <th className="px-4 py-2.5">Dosage</th>
                    <th className="px-4 py-2.5">Frequency</th>
                    <th className="px-4 py-2.5">Duration</th>
                    <th className="px-4 py-2.5">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medicines?.map((med, index) => (
                    <tr key={med.id || index} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-bold text-slate-400">{index + 1}</td>
                      <td className="px-4 py-2.5 font-black text-slate-900">{med.name}</td>
                      <td className="px-4 py-2.5 font-semibold text-slate-700">{med.dosage}</td>
                      <td className="px-4 py-2.5 font-bold text-emerald-700">{med.frequency}</td>
                      <td className="px-4 py-2.5 text-slate-600">{med.duration}</td>
                      <td className="px-4 py-2.5 text-slate-500 font-medium">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {prescription.generalAdvice && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-slate-800">Dietary & Lifestyle Advice:</span>
              <p className="text-slate-600 leading-relaxed">{prescription.generalAdvice}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-4 text-xs">
            <div>
              <p className="font-bold text-slate-800">
                Follow-up Date: <span className="text-purple-700 font-black">{prescription.followUpDate || "In 4 weeks"}</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Digitally authenticated electronic medical record
              </p>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-emerald-800 font-bold text-base mb-1">
                Dr. Priya Sharma
              </div>
              <div className="w-36 h-0.5 bg-slate-300 ml-auto mb-1"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Authorized Signature & Seal</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
