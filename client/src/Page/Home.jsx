import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Stethoscope,
  User,
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  Pill,
  HeartPulse,
  Award,
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen mesh-bg text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Hero Section */}
      <section className="mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-center gap-12 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border border-sky-200/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Next-Gen Unified Clinical Ecosystem</span>
          </div>

          <h1 className="text-4xl font-black leading-[1.1] text-slate-950 sm:text-5xl lg:text-6xl tracking-tight">
            Healthcare intelligence crafted for{" "}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              doctors, patients
            </span>{" "}
            & administrators.
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl font-normal">
            A cohesive healthcare operating system. Supervise clinical rosters and financial growth in the <strong className="text-slate-900 font-bold">Admin Panel</strong>, diagnose and issue digital prescriptions in the <strong className="text-slate-900 font-bold">Doctor Panel</strong>, and manage appointments and health history in the <strong className="text-slate-900 font-bold">Patient Portal</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-2xl bg-purple-700 hover:bg-purple-800 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-600/25 transition-all duration-200 hover:-translate-y-0.5 gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>

            <Link
              to="/doctor"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5 gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Panel</span>
            </Link>

            <Link
              to="/patient"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-600 hover:bg-sky-700 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-sky-600/25 transition-all duration-200 hover:-translate-y-0.5 gap-2"
            >
              <User className="w-4 h-4" />
              <span>Patient Hub</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>24 Board Certified Doctors</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>1,320+ Active Patients</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>99.4% Pharmacy Accuracy</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Card Preview */}
        <div className="w-full lg:max-w-xl">
          <div className="rounded-3xl bg-white p-7 sm:p-9 shadow-2xl shadow-slate-200/80 border border-slate-200/80 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Medicare Live Hub</h3>
                  <p className="text-xs text-slate-400">Integrated Multi-Role Cloud</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active System
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</p>
                <p className="text-2xl font-black text-slate-900 mt-1">$148,250</p>
                <p className="text-[11px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +18.4% quarterly growth
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctor Caseload</p>
                <p className="text-2xl font-black text-slate-900 mt-1">890 Consults</p>
                <p className="text-[11px] font-bold text-sky-600 mt-0.5">
                  Top specialty: Cardiology
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-100/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Pharmacy Inventory Status</span>
                <span className="text-emerald-700 font-extrabold">In Stock (3,410 Units)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                <div className="w-4/5 h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-500">
                Live prescription verification connected to certified pharmacists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Role Workspaces Showcase */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 border-t border-slate-200/80">
        <div className="mb-14 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Workspaces Built For Every Need
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Three Tailored Medical Experiences
          </h2>
          <p className="text-sm text-slate-600">
            Seamlessly navigate between administrator oversight, specialist clinical practice, and patient personal health records.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Admin Workspace Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-md shadow-purple-500/15 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase text-purple-700 tracking-wider">
                  Administrative Suite
                </span>
                <h3 className="text-2xl font-extrabold text-slate-950 mt-1">Admin Control Center</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Complete institutional oversight: inspect doctors' credentials and patient caseloads, track overall platform revenue and growth, review patient medical histories, and add pharmaceutical inventory.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Inspect complete doctor consultation histories</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Inspect chronological patient medical charts</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Add medicines & manage pharmacy stock levels</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Financial revenue streams & MoM growth graphs</span>
                </div>
              </div>
            </div>

            <Link
              to="/admin"
              className="mt-8 inline-flex items-center justify-between w-full py-3.5 px-5 rounded-2xl bg-purple-50 group-hover:bg-purple-700 text-purple-800 group-hover:text-white font-extrabold text-xs transition duration-200"
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Doctor Workspace Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-md shadow-emerald-500/15 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                  Clinical Workspace
                </span>
                <h3 className="text-2xl font-extrabold text-slate-950 mt-1">Doctor Clinical Portal</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Empowering medical specialists with daily patient arrival queues, consultation status workflows, digital prescription issuance from the medicine catalog, and consultation histories.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Today's appointment schedule & queue status</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital prescription & clinical diagnosis writer</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doctor's own patient encounter history</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Allergy warnings & chronic condition tags</span>
                </div>
              </div>
            </div>

            <Link
              to="/doctor"
              className="mt-8 inline-flex items-center justify-between w-full py-3.5 px-5 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white font-extrabold text-xs transition duration-200"
            >
              <span>Launch Doctor Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Patient Workspace Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-md shadow-sky-500/15 group-hover:scale-110 transition-transform">
                <User className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-black uppercase text-sky-700 tracking-wider">
                  Personal Health Hub
                </span>
                <h3 className="text-2xl font-extrabold text-slate-950 mt-1">Patient Wellness Hub</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Enabling patients to track upcoming doctor visits, schedule appointments with verified specialists, review active prescriptions with dosage reminders, and inspect their complete medical timeline.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Book specialist consultations online</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Active prescriptions & daily dosage schedules</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Complete chronological medical history</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Request pharmacy medicine refills</span>
                </div>
              </div>
            </div>

            <Link
              to="/patient"
              className="mt-8 inline-flex items-center justify-between w-full py-3.5 px-5 rounded-2xl bg-sky-50 group-hover:bg-sky-600 text-sky-800 group-hover:text-white font-extrabold text-xs transition duration-200"
            >
              <span>Launch Patient Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* About & Trust Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-sky-400">
              The Medicare Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              A Connected Health Ecosystem Built on Trust & Speed.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              MEDICARE unites hospital directors, clinicians, and patients onto a unified digital framework. With transparent financials, verified doctor encounters, and automated pharmacy fulfillment, we modernize healthcare delivery.
            </p>
          </div>
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </main>
  );
}
