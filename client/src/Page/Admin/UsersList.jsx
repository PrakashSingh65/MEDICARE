import React, { useState } from "react";
import { Search, Filter, Users, Eye, Mail, Phone, MapPin, Activity, FileText, AlertTriangle } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import { getPatients } from "../../data/mockData";

export default function UsersList() {
  const [patients] = useState(getPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = ["All", "Basic", "Standard", "Premium"];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.city && patient.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlan = selectedPlan === "All" || patient.plan === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  const handleOpenHistory = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <PanelLayout
      role="admin"
      title="Patient Records & Medical Histories"
      subtitle="Complete database of registered patient accounts, health coverage plans, and clinical history archives."
    >
      <div className="space-y-6">
        {/* Search & Filter Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient by name, email, or city..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-bold">Health Plan:</span>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {plans.map((p) => (
                  <option key={p} value={p}>
                    {p} Plan
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              {filteredPatients.length} Patients
            </span>
          </div>
        </div>

        {/* Patients Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => {
            const historyCount = patient.medicalHistory?.length || 0;
            const hasAllergies = patient.allergies && patient.allergies.length > 0 && !patient.allergies.includes("None");

            return (
              <article
                key={patient.id || patient.email}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-600 text-white font-black flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                        {patient.name?.charAt(0) || "P"}
                      </div>
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 leading-snug">{patient.name}</h2>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{patient.city || "India"}</span>
                          <span>•</span>
                          <span>{patient.age} yrs</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-black px-3 py-1 rounded-full border ${
                        patient.plan === "Premium"
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : patient.plan === "Standard"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {patient.plan}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Email:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[170px]">{patient.email}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Blood Group:</span>
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {patient.bloodGroup || "O+"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Clinical Encounters:</span>
                      <span className="font-black text-purple-700">{historyCount} visits logged</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Known Allergies:</span>
                      <span className={`font-bold truncate max-w-[150px] ${hasAllergies ? "text-red-600" : "text-slate-500"}`}>
                        {patient.allergies?.join(", ") || "None"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      patient.status === "Active"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {patient.status || "Active"}
                  </span>

                  <button
                    onClick={() => handleOpenHistory(patient)}
                    className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs group-hover:bg-purple-600 group-hover:text-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Patient History</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No patients found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No patient records match your current search query.
            </p>
          </div>
        )}
      </div>

      {/* Patient History Modal */}
      <PatientHistoryModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PanelLayout>
  );
}
