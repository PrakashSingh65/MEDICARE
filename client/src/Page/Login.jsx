import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/authApi";
import { setCredentials } from "../redux/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = loginUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          dispatch(setCredentials(data.user));
          navigate("/");
        },
      }
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-14 sm:px-10">
      <section className="mx-auto max-w-lg rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Welcome back</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Login to your account</h1>
          <p className="mt-3 text-sm text-slate-500">
            Enter your credentials to access your Medicare dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          {loginMutation.isError ? (
            <p className="text-sm text-red-600">{loginMutation.error?.response?.data?.message || "Login failed."}</p>
          ) : null}

          <button
            type="submit"
            disabled={loginMutation.isLoading}
            className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
