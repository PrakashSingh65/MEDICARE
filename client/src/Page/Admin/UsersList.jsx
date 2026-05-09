import React from "react";
import { Link } from "react-router-dom";

const users = [
  { name: "Aditi Kapoor", email: "aditi.kapoor@example.com", city: "Mumbai", age: 32, plan: "Premium", joined: "2024-01-15", status: "Active" },
  { name: "Rohan Mehta", email: "rohan.mehta@example.com", city: "Delhi", age: 28, plan: "Basic", joined: "2024-03-04", status: "Active" },
  { name: "Sneha Patel", email: "sneha.patel@example.com", city: "Ahmedabad", age: 39, plan: "Standard", joined: "2023-11-22", status: "Active" },
  { name: "Vikram Nair", email: "vikram.nair@example.com", city: "Bangalore", age: 45, plan: "Premium", joined: "2023-08-11", status: "Active" },
  { name: "Priya Desai", email: "priya.desai@example.com", city: "Pune", age: 26, plan: "Basic", joined: "2024-04-02", status: "Pending" },
  { name: "Karan Shah", email: "karan.shah@example.com", city: "Chennai", age: 31, plan: "Standard", joined: "2024-02-18", status: "Active" },
  { name: "Meera Joshi", email: "meera.joshi@example.com", city: "Hyderabad", age: 37, plan: "Premium", joined: "2023-09-27", status: "Active" },
  { name: "Aarav Kulkarni", email: "aarav.kulkarni@example.com", city: "Nagpur", age: 29, plan: "Basic", joined: "2024-05-01", status: "Active" },
  { name: "Pooja Verma", email: "pooja.verma@example.com", city: "Jaipur", age: 34, plan: "Standard", joined: "2023-12-06", status: "Active" },
  { name: "Nikhil Reddy", email: "nikhil.reddy@example.com", city: "Kolkata", age: 42, plan: "Premium", joined: "2023-10-14", status: "Active" },
];

export default function UsersList() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">User list</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Demo user directory</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Sample user accounts displayed in card form with email, plan, location, and status.
              </p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Back to dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => (
            <article key={user.email} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{user.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${user.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {user.status}
                </span>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">City:</span> {user.city}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Age:</span> {user.age}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Plan:</span> {user.plan}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Joined:</span> {user.joined}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {user.plan}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {user.city}
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
