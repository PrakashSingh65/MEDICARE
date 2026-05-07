import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center gap-10 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-sky-600">MEDICARE</p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Healthcare guidance for every step of your care journey.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Book appointments, explore trusted providers, and manage your family's
            care with confidence from one clean, modern portal.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#services" className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-sky-600/20 transition hover:bg-sky-700">
              Explore services
            </a>
            <a href="#about" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Learn more
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/80 ring-1 ring-slate-100 lg:max-w-xl">
          <div className="space-y-6">
            <div className="rounded-3xl bg-sky-600/10 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Fast provider access</h2>
              <p className="mt-3 text-slate-600">Search verified doctors, clinics, and specialists with the right care near you.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-100 p-5">
                <h3 className="font-semibold">Appointment support</h3>
                <p className="mt-2 text-sm text-slate-600">Schedule visits and get reminders that keep your care on track.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-5">
                <h3 className="font-semibold">Trusted resources</h3>
                <p className="mt-2 text-sm text-slate-600">Access guides for insurance, wellness, and treatment options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-6 pb-16 sm:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Services</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">What we offer</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Provider search</h3>
            <p className="mt-4 text-slate-600">Find local doctors and care teams with verified ratings and specialties.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Booking support</h3>
            <p className="mt-4 text-slate-600">Schedule appointments quickly and receive reminders for every visit.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Care guidance</h3>
            <p className="mt-4 text-slate-600">Use curated articles and resources to manage treatment and wellness.</p>
          </article>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
        <div className="rounded-3xl bg-slate-950 px-8 py-12 text-white sm:px-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold">Why MEDICARE?</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              MEDICARE helps patients and families stay informed, connected, and
              supported through every stage of their healthcare journey.
            </p>
            <ul className="mt-8 space-y-4 text-slate-300">
              <li>• Clear care navigation from provider discovery to appointment follow-up.</li>
              <li>• Simple access to health resources and provider information.</li>
              <li>• A trusted portal designed for family-centered healthcare support.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
