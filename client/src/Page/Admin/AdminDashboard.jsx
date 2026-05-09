import React, { useState } from "react";
import AdminStatCard from "../../components/AdminStatCard";
import PaymentChart from "../../components/PaymentChart";

const demoDoctors = [
  { name: "Dr. Priya Sharma", specialty: "Cardiology", location: "Bangalore", patients: 124 },
  { name: "Dr. Ankit Verma", specialty: "General Practice", location: "Mumbai", patients: 98 },
  { name: "Dr. Meera Singh", specialty: "Pediatrics", location: "Delhi", patients: 76 },
  { name: "Dr. Rohit Patel", specialty: "Orthopedics", location: "Chennai", patients: 88 },
];

const paymentData = {
  day: [
    { label: "Mon", amount: 1240 },
    { label: "Tue", amount: 1860 },
    { label: "Wed", amount: 1640 },
    { label: "Thu", amount: 2120 },
    { label: "Fri", amount: 1780 },
    { label: "Sat", amount: 1440 },
    { label: "Sun", amount: 1980 },
  ],
  month: [
    { label: "Jan", amount: 21200 },
    { label: "Feb", amount: 23900 },
    { label: "Mar", amount: 28100 },
    { label: "Apr", amount: 26300 },
    { label: "May", amount: 29500 },
    { label: "Jun", amount: 32800 },
    { label: "Jul", amount: 31000 },
    { label: "Aug", amount: 33900 },
    { label: "Sep", amount: 32200 },
    { label: "Oct", amount: 34700 },
    { label: "Nov", amount: 36300 },
    { label: "Dec", amount: 39200 },
  ],
  year: [
    { label: "2021", amount: 312000 },
    { label: "2022", amount: 345000 },
    { label: "2023", amount: 398000 },
    { label: "2024", amount: 428000 },
  ],
};

export default function AdminDashboard() {
  const [range, setRange] = useState("month");

  const stats = [
    {
      title: "Total doctors",
      value: 24,
      detail: "Active doctors available in the network.",
      icon: <span className="text-2xl">👩‍⚕️</span>,
    },
    {
      title: "Total users",
      value: 1324,
      detail: "Registered patients and account holders.",
      icon: <span className="text-2xl">👥</span>,
    },
    {
      title: "Monthly revenue",
      value: "$39.2k",
      detail: "Revenue collected in the selected period.",
      icon: <span className="text-2xl">💰</span>,
    },
    {
      title: "New signups",
      value: 87,
      detail: "New users registered this month.",
      icon: <span className="text-2xl">📝</span>,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Admin dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Overview of doctors, users, and payments</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                View demo data for doctor coverage, user count, and payment performance with daily, monthly, and yearly insight.
              </p>
            </div>
            <div className="space-y-2 rounded-3xl bg-slate-100 p-4 sm:space-y-0 sm:p-0">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Select period</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.keys(paymentData).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRange(key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${range === key ? "bg-sky-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-4">
          {stats.map((stat) => (
            <AdminStatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <div>
            <PaymentChart data={paymentData[range]} seriesLabel={`${range.charAt(0).toUpperCase() + range.slice(1)} payments`} />
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Doctor panel</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">Top doctors</h2>
              <div className="mt-6 space-y-4">
                {demoDoctors.map((doctor) => (
                  <div key={doctor.name} className="rounded-3xl bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{doctor.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{doctor.specialty} — {doctor.location}</p>
                      </div>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{doctor.patients} patients</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Key metrics</p>
              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-600">Average booking time</dt>
                  <dd className="font-semibold text-slate-900">18 mins</dd>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-600">Care requests</dt>
                  <dd className="font-semibold text-slate-900">58 open</dd>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-600">Payment success rate</dt>
                  <dd className="font-semibold text-slate-900">98.4%</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
