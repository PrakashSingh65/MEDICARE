import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, XCircle, FileText, AlertTriangle, Building, Award, Calendar, Check, ExternalLink } from "lucide-react";

export default function DoctorVerificationModal({ doctor, isOpen, onClose, onVerifyDoc, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !doctor) return null;

  const docs = doctor.documents || [];
  const allVerified = docs.length > 0 && docs.every((d) => d.verified);

  const handleApprove = () => {
    onApprove(doctor.id);
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    onReject(doctor.id, rejectReason);
    setShowRejectInput(false);
    setRejectReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Verify Doctor Qualifications</h3>
              <p className="text-xs text-purple-200 font-medium">Credential validation & compliance audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-base">{doctor.name}</h4>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    doctor.verificationStatus === "Verified"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : doctor.verificationStatus === "Pending"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {doctor.verificationStatus || "Pending Review"}
                </span>
              </div>
              <p className="text-xs font-bold text-purple-700 mt-0.5">{doctor.specialty} • {doctor.experience} yrs practice</p>
              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{doctor.clinic}</span>
              </p>
              <p className="text-xs text-slate-600 font-semibold mt-2">
                Degree: <span className="font-normal text-slate-700">{doctor.qualification}</span>
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Submitted Medical Credentials & Licenses
              </h5>
              <span className="text-xs text-slate-500 font-bold">
                {docs.filter((d) => d.verified).length} of {docs.length} verified
              </span>
            </div>

            <div className="space-y-2.5">
              {docs.map((docItem) => (
                <div
                  key={docItem.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        docItem.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {docItem.name}
                        <ExternalLink className="w-3 h-3 text-slate-400 cursor-pointer hover:text-purple-600" />
                      </p>
                      <p className="text-[11px] text-slate-400">Category: {docItem.type} document</p>
                    </div>
                  </div>

                  {docItem.verified ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => onVerifyDoc(doctor.id, docItem.id)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Verified
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {showRejectInput && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3 animate-fadeIn">
              <label className="block text-xs font-extrabold text-red-900">
                Reason for Registration Rejection:
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State specific credential deficiencies or unverified state council licenses..."
                className="w-full p-3 rounded-xl border border-red-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!showRejectInput && (
              <button
                onClick={() => setShowRejectInput(true)}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Reject Registration
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              onClick={handleApprove}
              disabled={doctor.verificationStatus === "Verified"}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
