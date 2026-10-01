import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Building,
  User,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  Send,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getAdminPayments,
  processAdminRefund,
  resolveFailedPayment,
  executePayout,
} from "../../data/adminMockData";

export default function PaymentManagement() {
  const [paymentData, setPaymentData] = useState(getAdminPayments);
  const [activeTab, setActiveTab] = useState("transactions");
  const [txSearch, setTxSearch] = useState("");
  const [txStatusFilter, setTxStatusFilter] = useState("All");

  const transactions = paymentData.transactions || [];
  const refunds = paymentData.refunds || [];
  const failedPayments = paymentData.failedPayments || [];
  const doctorPayouts = paymentData.doctorPayouts || [];

  const totalGrossRevenue = 248500;
  const platformFeeRevenue = 24850;
  const totalDoctorPayouts = 223650;
  const pendingRefundsAmount = refunds
    .filter((r) => r.status === "Pending")
    .reduce((sum, r) => sum + r.amount, 0);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.invoiceNo.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.patientName.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.doctorName.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.department.toLowerCase().includes(txSearch.toLowerCase());
    const matchesStatus =
      txStatusFilter === "All" || tx.status === txStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveRefund = (refundId) => {
    const updated = processAdminRefund(refundId, "Approved");
    setPaymentData(updated);
  };

  const handleRejectRefund = (refundId) => {
    const updated = processAdminRefund(refundId, "Rejected");
    setPaymentData(updated);
  };

  const handleResolveFailedPayment = (fpId) => {
    const updated = resolveFailedPayment(fpId);
    setPaymentData(updated);
  };

  const handleExecutePayout = (payoutId) => {
    const updated = executePayout(payoutId);
    setPaymentData(updated);
  };

  const departmentRevenue = [
    { name: "Cardiology", amount: 72400, percent: "29.1%" },
    { name: "General Medicine", amount: 58200, percent: "23.4%" },
    { name: "Dermatology", amount: 44100, percent: "17.7%" },
    { name: "Neurology", amount: 38900, percent: "15.6%" },
    { name: "Pediatrics & Ortho", amount: 34900, percent: "14.2%" },
  ];

  return (
    <PanelLayout
      role="admin"
      title="Payment Management"
      subtitle="Financial operations oversight: transactions ledger, revenue breakdown, patient refund claims, failed payments, and doctor payout execution."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Gross Platform Revenue</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">${totalGrossRevenue.toLocaleString()}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Medicare Platform Cut (10%)</p>
              <p className="text-xl font-black text-purple-600 mt-0.5">${platformFeeRevenue.toLocaleString()}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Doctor Net Disbursed</p>
              <p className="text-xl font-black text-indigo-600 mt-0.5">${totalDoctorPayouts.toLocaleString()}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Pending Refunds</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">${pendingRefundsAmount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "transactions"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "revenue"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Revenue Analytics
          </button>
          <button
            onClick={() => setActiveTab("refunds")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "refunds"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Refunds ({refunds.length})
          </button>
          <button
            onClick={() => setActiveTab("failed")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "failed"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Failed Payments ({failedPayments.length})
          </button>
          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              activeTab === "payouts"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            Doctor Payouts ({doctorPayouts.length})
          </button>
        </div>

        {activeTab === "transactions" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder="Search invoice, patient, doctor, department..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-bold">Status:</span>
                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Invoice #</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Specialist & Department</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment Method</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-black text-slate-900 text-xs">{tx.invoiceNo}</td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-xs">{tx.patientName}</td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-slate-800">{tx.doctorName}</p>
                          <p className="text-[11px] text-purple-700 font-medium">{tx.department}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-emerald-600 text-xs">${tx.amount}</td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600">{tx.method}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">{tx.date} at {tx.time}</td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              tx.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : tx.status === "Refunded"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : tx.status === "Failed"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {tx.status}
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

        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-4">Department Revenue Distribution</h3>
              <div className="space-y-4">
                {departmentRevenue.map((dep, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{dep.name}</span>
                      <span className="text-slate-900 font-black">${dep.amount.toLocaleString()} ({dep.percent})</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                        style={{ width: dep.percent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Platform Margin</span>
                <p className="text-3xl font-black text-emerald-400">10.0%</p>
                <p className="text-xs text-slate-400">Fixed institutional surcharge on every completed consultation.</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Consultation Fee</span>
                <p className="text-3xl font-black text-sky-400">$68.50</p>
                <p className="text-xs text-slate-400">Calculated across 3,420 completed telemedicine & clinical visits.</p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-md space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Run-rate</span>
                <p className="text-3xl font-black text-purple-300">$38,400</p>
                <p className="text-xs text-slate-400">Projected annualized clinical revenue of $460,000+.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "refunds" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Refund ID</th>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {refunds.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900 text-xs">{ref.refundId}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700 text-xs">{ref.invoiceNo}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-xs">{ref.patientName}</td>
                      <td className="px-6 py-4 font-black text-emerald-600 text-xs">${ref.amount}</td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">{ref.reason}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            ref.status === "Approved" || ref.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : ref.status === "Pending"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {ref.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveRefund(ref.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRefund(ref.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "failed" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Failure Reason</th>
                    <th className="px-6 py-4">Attempts</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {failedPayments.map((fp) => (
                    <tr key={fp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900 text-xs">{fp.invoiceNo}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-xs">{fp.patientName}</td>
                      <td className="px-6 py-4 font-black text-red-600 text-xs">${fp.amount}</td>
                      <td className="px-6 py-4 text-xs text-red-700 font-medium max-w-sm">{fp.failureReason}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{fp.attempts}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            fp.status === "Resolved"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {fp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {fp.status !== "Resolved" ? (
                          <button
                            onClick={() => handleResolveFailedPayment(fp.id)}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-2xs"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Cleared</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Batch ID</th>
                    <th className="px-6 py-4">Specialist Doctor</th>
                    <th className="px-6 py-4">Bank Account & IFSC</th>
                    <th className="px-6 py-4">Consultations</th>
                    <th className="px-6 py-4">Gross Total</th>
                    <th className="px-6 py-4">Platform Fee (10%)</th>
                    <th className="px-6 py-4">Net Payout</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctorPayouts.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900 text-xs">{po.payoutBatch}</td>
                      <td className="px-6 py-4">
                        <p className="font-extrabold text-slate-900 text-xs">{po.doctorName}</p>
                        <p className="text-[11px] text-purple-700 font-medium">{po.specialty}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-600">
                        {po.bankAccount}
                        <span className="block text-[10px] text-slate-400 font-normal">IFSC: {po.ifsc}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">{po.consultations} cases</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">${po.grossAmount}</td>
                      <td className="px-6 py-4 text-xs font-bold text-amber-600">-${po.platformCut}</td>
                      <td className="px-6 py-4 text-xs font-black text-emerald-600">${po.netPayout}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            po.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : po.status === "Processing"
                              ? "bg-sky-100 text-sky-800 border-sky-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {po.status !== "Paid" ? (
                          <button
                            onClick={() => handleExecutePayout(po.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Disburse</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">Transferred</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
