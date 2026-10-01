import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, KeyRound, CheckCircle2, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!email) return;
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setIsSuccess(true);
    setStep(3);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 sm:px-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-slate-200 border border-slate-100 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {step === 3 ? "Password Reset" : "Forgot Password?"}
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            {step === 1 && "Enter your registered email address to receive a secure recovery code."}
            {step === 2 && "Enter the 6-digit code sent to your email and define your new password."}
            {step === 3 && "Your password has been successfully updated. You can now sign in."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="aditi.kapoor@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700 py-3 text-sm font-bold text-white shadow-md transition"
            >
              Send Verification Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="849201"
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700 py-3 text-sm font-bold text-white shadow-md transition"
            >
              Update Password
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Your password has been securely reset. You can now use your new credentials to log into Medicare.
            </p>
            <Link
              to="/login"
              className="inline-block w-full rounded-2xl bg-sky-600 hover:bg-sky-700 py-3 text-sm font-bold text-white shadow-md transition"
            >
              Sign In Now
            </Link>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
