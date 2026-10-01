import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  Clock,
  RotateCcw,
  DollarSign,
  Download,
  Printer,
  Eye,
  Plus,
  ShieldCheck,
  Building,
  Smartphone,
  AlertCircle,
  FileText,
  Search,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PatientInvoiceModal from "../../components/panels/PatientInvoiceModal";
import {
  getPatientPayments,
  makePatientPayment,
  getAvailableDoctors
} from "../../data/patientMockData";

export default function PatientPayments() {
  const [paymentsData, setPaymentsData] = useState(getPatientPayments);
  const doctors = getAvailableDoctors();

  const [activeTab, setActiveTab] = useState("history");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [payDoctorId, setPayDoctorId] = useState(doctors[0]?.id || "doc-1");
  const [payMethod, setPayMethod] = useState("Credit Card (•••• 4920)");
  const [customAmount, setCustomAmount] = useState(doctors[0]?.fee || 75);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedDoctor = doctors.find((d) => d.id === payDoctorId) || doctors[0];

  const handleDoctorChange = (id) => {
    setPayDoctorId(id);
    const doc = doctors.find((d) => d.id === id);
    if (doc) setCustomAmount(doc.fee);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const newTx = makePatientPayment({
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        amount: Number(customAmount),
        method: payMethod,
        description: `Consultation fee for ${selectedDoctor.specialty} appointment`
      });

      setPaymentsData(getPatientPayments());
      setIsProcessing(false);
      setPaymentSuccessToast(
        `Payment of $${customAmount} confirmed! Invoice #${newTx.invoiceNo} has been issued.`
      );
      setTimeout(() => setPaymentSuccessToast(""), 5000);
    }, 900);
  };

  const handleOpenInvoice = (tx) => {
    setSelectedInvoice(tx);
    setIsInvoiceModalOpen(true);
  };

  const filteredTransactions = paymentsData.transactions?.filter((tx) => {
    return (
      tx.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  return (
    <PanelLayout
      role="patient"
      title="Payments, Invoices & Refund Tracking"
      subtitle="Settle specialist consultation fees securely, inspect automated GST billing invoices, print receipts, and track refund lifecycles."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {paymentSuccessToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{paymentSuccessToast}</span>
            </div>
            <button
              onClick={() => setPaymentSuccessToast("")}
              className="text-emerald-700 hover:text-emerald-950 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Health Spend</p>
              <h3 className="text-xl font-black text-slate-900">
                ${paymentsData.transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Invoices Issued</p>
              <h3 className="text-xl font-black text-slate-900">
                {paymentsData.transactions?.length || 0} Receipts
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Refund Status</p>
              <h3 className="text-xl font-black text-slate-900">
                {paymentsData.refunds?.length || 0} Processed
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Instant Consultation Fee Settlement</h3>
              <p className="text-xs text-slate-500">Pay ahead for scheduled appointments or follow-up consultations</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 self-start sm:self-center">
              <ShieldCheck className="w-3.5 h-3.5" />
              256-Bit Encrypted Gateway
            </span>
          </div>

          <form onSubmit={handleProcessPayment} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-1">
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Specialist</label>
              <select
                value={payDoctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Credit Card (•••• 4920)">Credit Card (•••• 4920)</option>
                <option value="UPI: aditi.kapoor@okhdfcbank">UPI: aditi.kapoor@okhdfcbank</option>
                <option value="HDFC NetBanking">HDFC NetBanking</option>
                <option value="Star Health TPA Claim">Star Health TPA Claim</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Amount ($ USD)</label>
              <input
                type="number"
                min="10"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-black shadow-sm transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Authorizing...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ${customAmount} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "history"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Payment History</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800">
              {paymentsData.transactions?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("refunds")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "refunds"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refund Status</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {paymentsData.refunds?.length || 0}
            </span>
          </button>
        </div>

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search transactions by invoice #, doctor name, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Invoice / Receipt #</th>
                      <th className="py-3 px-4">Doctor & Specialty</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {tx.invoiceNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block">{tx.doctorName}</span>
                          <span className="text-[11px] text-sky-700">{tx.specialty}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {tx.date} at {tx.time}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">{tx.method}</td>
                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          ${tx.amount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenInvoice(tx)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "refunds" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Refund Claims & Credit Ledger</h3>
                <p className="text-xs text-slate-500">
                  Track full and partial refunds credited back to your original payment instruments.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Refund ID</th>
                      <th className="py-3 px-4">Original Invoice</th>
                      <th className="py-3 px-4">Processed Date</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Refunded Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paymentsData.refunds?.map((ref) => (
                      <tr key={ref.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {ref.id}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {ref.invoiceNo}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{ref.date}</td>
                        <td className="py-3.5 px-4 text-slate-700 max-w-xs">{ref.reason}</td>
                        <td className="py-3.5 px-4 font-black text-emerald-600 text-sm">
                          ${ref.refundAmount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              ref.status === "Processed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {ref.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <PatientInvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </PanelLayout>
  );
}
