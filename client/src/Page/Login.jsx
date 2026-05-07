import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
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

        <form className="space-y-6">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Login
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
