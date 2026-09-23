import React, { useState } from "react";
import { Search, Filter, Users, Eye, Mail, Phone, MapPin, Activity, FileText } from "lucide-react";
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
      title="Patients Directory & Medical Records"
      subtitle="Complete list of registered patient accounts, health plans, and access to complete chronological clinical histories."
    >
      <div className="space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient by name, email, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Health Plan:</span>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {plans.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">
              {filteredPatients.length} Patients Listed
            </span>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => {
            const historyCount = patient.medicalHistory?.length || 0;
            return (
              <article
                key={patient.id || patient.email}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                        {patient.name?.charAt(0) || "P"}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-snug">{patient.name}</h2>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{patient.city || "India"}</span>
                          <span>•</span>
                          <span>{patient.age} yrs</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        patient.plan === "Premium"
                          ? "bg-purple-100 text-purple-800"
                          : patient.plan === "Standard"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {patient.plan}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[180px]">{patient.email}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Blood Group:</span>
                      <span className="font-bold text-emerald-700">{patient.bloodGroup || "O+"}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Recorded Consults:</span>
                      <span className="font-semibold text-sky-600">{historyCount} visits</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Allergies:</span>
                      <span className="font-medium text-red-600 truncate max-w-[160px]">
                        {patient.allergies?.join(", ") || "None"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      patient.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {patient.status || "Active"}
                  </span>
                  <button
                    onClick={() => handleOpenHistory(patient)}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
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
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No patients found matching your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try searching by another name or plan filter.</p>
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
