import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Stethoscope, User, ArrowRight, Activity, Sparkles, TrendingUp, Pill } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="mx-auto flex min-h-[75vh] max-w-7xl flex-col justify-center gap-10 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Next-Gen Healthcare Management</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl tracking-tight">
            Comprehensive care navigation for doctors, patients & administrators.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Experience MEDICARE: an integrated digital health suite with specialized portals for Admin oversight, Doctor clinical operations, and Patient wellness tracking.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-2xl bg-purple-700 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-purple-800 transition gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
            <Link
              to="/doctor"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Panel</span>
            </Link>
            <Link
              to="/patient"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-sky-700 transition gap-2"
            >
              <User className="w-4 h-4" />
              <span>Patient Panel</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80 ring-1 ring-slate-100 lg:max-w-xl space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 p-6 border border-sky-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Live Clinical Network</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Unified Multi-Role Portal</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Real-time synchronization between doctor consultations, pharmacy medicine inventory, revenue growth analytics, and patient medical records.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Doctors Roster</p>
              <p className="text-xl font-bold text-slate-900 mt-1">24 Specialists</p>
              <p className="text-xs text-slate-500 mt-0.5">Cardiology, Ortho, Peds</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">$148.2k</p>
              <p className="text-xs text-slate-500 mt-0.5">+18.4% quarterly growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Portals Grid Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600">Explore System Portals</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Tailored Workspaces for Every Role</h2>
          <p className="mt-3 text-sm text-slate-600">
            Switch seamlessly between the administrator control room, the specialist clinical interface, and the patient wellness dashboard.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Admin Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-bold text-purple-700 tracking-wider">Administrative Suite</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Admin Control Center</h3>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Full visibility across all doctors, patients directory, total platform revenue, overall financial growth, doctor & patient history inspection, and centralized pharmacy inventory management.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  Inspect complete doctor consultation histories
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  Inspect patient chronological health records
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  Add and manage pharmacy medicine stocks
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                  Deep-dive revenue & growth metrics
                </li>
              </ul>
            </div>
            <Link
              to="/admin"
              className="mt-8 inline-flex items-center justify-between w-full py-3 px-5 rounded-2xl bg-purple-50 group-hover:bg-purple-700 text-purple-800 group-hover:text-white font-bold text-xs transition"
            >
              <span>Launch Admin Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Doctor Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Clinical Workspace</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Doctor Clinical Portal</h3>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Empowering medical specialists with daily patient consultation queues, appointment status management, digital prescription issuance from medicine catalog, and consultation histories.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Today's appointment schedule & queue
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Write prescriptions & record diagnoses
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Doctor's own patient encounter history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Clinical patient chart reviews
                </li>
              </ul>
            </div>
            <Link
              to="/doctor"
              className="mt-8 inline-flex items-center justify-between w-full py-3 px-5 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white font-bold text-xs transition"
            >
              <span>Launch Doctor Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-6 group-hover:scale-105 transition-transform">
                <User className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-bold text-sky-700 tracking-wider">Personal Health Portal</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Patient Wellness Hub</h3>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Enabling patients to track upcoming doctor visits, schedule appointments with specialists, review active prescriptions with dosage reminders, and inspect their complete medical timeline.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  Book specialist appointments online
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  Active prescriptions & dosage schedules
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  Complete chronological medical history
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                  Request pharmacy medicine refills
                </li>
              </ul>
            </div>
            <Link
              to="/patient"
              className="mt-8 inline-flex items-center justify-between w-full py-3 px-5 rounded-2xl bg-sky-50 group-hover:bg-sky-600 text-sky-800 group-hover:text-white font-bold text-xs transition"
            >
              <span>Launch Patient Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
        <div className="rounded-3xl bg-slate-950 px-8 py-12 text-white sm:px-12 shadow-xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Why MEDICARE Portal?</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              MEDICARE unites administrators, clinical staff, and patients into a single reliable healthcare network. With transparent financials, audited doctor encounters, and a centralized pharmacy catalog, we help healthcare organizations operate with clarity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
