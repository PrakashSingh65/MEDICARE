import React from "react";
import { Link } from "react-router-dom";

const doctors = [
  {
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    clinic: "HeartCare Clinic",
    location: "Bangalore",
    experience: 12,
    rating: 4.9,
    patients: 124,
  },
  {
    name: "Dr. Ankit Verma",
    specialty: "General Practice",
    clinic: "CityHealth Center",
    location: "Mumbai",
    experience: 8,
    rating: 4.7,
    patients: 98,
  },
  {
    name: "Dr. Meera Singh",
    specialty: "Pediatrics",
    clinic: "Little Steps Clinic",
    location: "Delhi",
    experience: 10,
    rating: 4.8,
    patients: 76,
  },
  {
    name: "Dr. Rohit Patel",
    specialty: "Orthopedics",
    clinic: "BoneCare Hospital",
    location: "Chennai",
    experience: 14,
    rating: 4.6,
    patients: 88,
  },
  {
    name: "Dr. Leena Dutta",
    specialty: "Dermatology",
    clinic: "SkinWell Studio",
    location: "Kolkata",
    experience: 9,
    rating: 4.7,
    patients: 72,
  },
  {
    name: "Dr. Aarav Joshi",
    specialty: "Neurology",
    clinic: "NeuroPoint Hospital",
    location: "Pune",
    experience: 15,
    rating: 4.8,
    patients: 109,
  },
  {
    name: "Dr. Sneha Rao",
    specialty: "Gynecology",
    clinic: "MotherCare Clinic",
    location: "Hyderabad",
    experience: 11,
    rating: 4.9,
    patients: 95,
  },
  {
    name: "Dr. Karan Singh",
    specialty: "ENT",
    clinic: "SoundHealth Center",
    location: "Ahmedabad",
    experience: 7,
    rating: 4.6,
    patients: 66,
  },
  {
    name: "Dr. Nisha Kapoor",
    specialty: "Ophthalmology",
    clinic: "VisionCare Eye Hospital",
    location: "Jaipur",
    experience: 13,
    rating: 4.8,
    patients: 81,
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Endocrinology",
    clinic: "Balance Health Clinic",
    location: "Lucknow",
    experience: 10,
    rating: 4.7,
    patients: 74,
  },
];

export default function Doctorlist() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Doctor list</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Available practitioners</h1>
              <p className="mt-3 max-w-2xl text-slate-600">
                Demo doctor roster showing specialties, clinic locations, experience, ratings, and patient load.
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

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <article key={doctor.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{doctor.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{doctor.specialty}</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
                  {doctor.rating} ★
                </span>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Clinic:</span> {doctor.clinic}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Location:</span> {doctor.location}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Experience:</span> {doctor.experience} years
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Patients:</span> {doctor.patients}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {doctor.specialty}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {doctor.location}
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
