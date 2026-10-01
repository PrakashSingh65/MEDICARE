import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Phone, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";

export default function VerifyContact() {
  const [activeChannel, setActiveChannel] = useState("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.join("").length === 6) {
      setIsVerified(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 sm:px-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-slate-200 border border-slate-100 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Verify Your Contact
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Confirm your identity to enable automated appointment reminders, prescription alerts, and invoice downloads.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100">
          <button
            type="button"
            onClick={() => {
              setActiveChannel("email");
              setIsVerified(false);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeChannel === "email" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Verify</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveChannel("phone");
              setIsVerified(false);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeChannel === "phone" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone SMS</span>
          </button>
        </div>

        {!isVerified ? (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="text-center text-xs text-slate-600">
              {activeChannel === "email" ? (
                <p>We sent a 6-digit code to <strong>aditi.kapoor@example.com</strong></p>
              ) : (
                <p>We sent an SMS code to <strong>+91 98111 •••••</strong></p>
              )}
            </div>

            <div className="flex justify-between gap-2">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className="w-12 h-14 rounded-2xl border-2 border-slate-200 text-center font-mono text-lg font-black text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={code.join("").length !== 6}
              className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700 py-3 text-sm font-bold text-white shadow-md transition disabled:opacity-50"
            >
              Verify & Activate Contact
            </button>

            <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <span>Didn't receive the code?</span>
              <button
                type="button"
                className="font-bold text-sky-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Resend Code
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Verification Successful!</h3>
            <p className="text-xs text-slate-500 font-medium">
              Your {activeChannel} is now verified and linked to your Medicare patient record.
            </p>
            <Link
              to="/patient/profile"
              className="inline-block w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white shadow-md transition"
            >
              Go to Patient Profile
            </Link>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 text-center">
          <Link
            to="/patient/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Profile</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
