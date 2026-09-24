import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Stethoscope, User, Sparkles } from "lucide-react";
import { setCredentials } from "../redux/authSlice";
import { useSignup } from "../api/authApi";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (image) {
      formData.append("image", image);
    }

    signupMutation.mutate(formData, {
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
          navigate("/login");
        }
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 sm:px-10">
      <section className="mx-auto max-w-lg rounded-3xl bg-white p-8 sm:p-10 shadow-xl shadow-slate-200 border border-slate-100">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Registration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="mt-2 text-xs text-slate-500">
            Join MEDICARE to access your clinical dashboard or patient portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  role === "patient"
                    ? "border-sky-500 bg-sky-50/80 text-sky-800 ring-2 ring-sky-200 shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className={`p-2 rounded-xl ${role === "patient" ? "bg-sky-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  role === "doctor"
                    ? "border-emerald-500 bg-emerald-50/80 text-emerald-800 ring-2 ring-emerald-200 shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className={`p-2 rounded-xl ${role === "doctor" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Doctor</span>
              </button>
            </div>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Jane Doe"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Profile image</span>
            <input
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              type="file"
              accept="image/*"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          {signupMutation.isError ? (
            <p className="text-sm text-red-600">{signupMutation.error?.response?.data?.message || "Signup failed."}</p>
          ) : null}

          <button
            type="submit"
            disabled={signupMutation.isLoading}
            className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signupMutation.isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
