import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Lock, Mail, AlertCircle, Sparkles } from "lucide-react";
import { useLogin } from "../api/authApi";
import { setCredentials } from "../redux/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data?.user) {
            dispatch(setCredentials(data.user));
            if (data.user.role === "admin") {
              navigate("/admin");
            } else if (data.user.role === "doctor") {
              navigate("/doctor");
            } else {
              navigate("/patient");
            }
          } else {
            navigate("/");
          }
        },
      }
    );
  };

  const isSubmitting = loginMutation.isPending || loginMutation.isLoading;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 sm:px-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-slate-200 border border-slate-100 space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Medicare Access Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-xs text-slate-500">
            Sign in to access your clinical dashboard or patient portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>
          </div>

          {loginMutation.isError ? (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginMutation.error?.response?.data?.message || "Login failed. Please check credentials."}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-sky-600 hover:bg-sky-700 py-3 text-sm font-bold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In to Medicare"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-bold text-sky-600 hover:text-sky-700">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
