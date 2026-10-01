import React from "react";
import { X, Printer, Download, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PatientInvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm">Consultation Payment Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-white text-slate-800">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">MEDICARE</h2>
              <p className="text-xs text-slate-500 font-medium">Healthcare Telemedicine & Clinical Systems</p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">GSTIN: 29AABCM8492Q1ZT</p>
            </div>
            <div className="text-right text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Invoice Number</span>
              <span className="font-mono font-black text-slate-900 text-sm">{invoice.invoiceNo}</span>
              <span className="text-slate-500 block mt-0.5">{invoice.date}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To (Patient)</span>
              <span className="font-black text-slate-900">Aditi Kapoor</span>
              <span className="text-slate-500 block text-[11px]">Bangalore, Karnataka</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Medical Specialist</span>
              <span className="font-black text-slate-900">{invoice.doctorName}</span>
              <span className="text-purple-700 font-bold block text-[11px]">{invoice.specialty}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{invoice.description || "Clinical Specialist Consultation Fee"}</p>
                    <p className="text-slate-400 text-[11px]">Appointment: {invoice.appointmentNumber || "Standard Clinical Visit"}</p>
                  </td>
                  <td className="p-3 text-right font-black text-slate-900">${invoice.amount}</td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-500 font-medium">Healthcare Digital Processing Fee</td>
                  <td className="p-3 text-right text-slate-500 font-medium">$0.00</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-black border-t border-slate-200">
                <tr>
                  <td className="p-3 text-slate-900">Total Paid</td>
                  <td className="p-3 text-right text-emerald-600 text-sm">${invoice.amount}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Status: <strong className="uppercase">{invoice.status}</strong></span>
            </div>
            <span className="text-slate-600 font-mono text-[11px]">{invoice.paymentMethod}</span>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
            <p>This is a computer-generated tax invoice and requires no physical signature.</p>
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Medicare Encrypted Transaction</span>
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
