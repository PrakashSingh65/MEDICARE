import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Activity,
  MapPin,
  Calendar,
  CreditCard,
  UserCheck,
  UserX,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PatientActivityModal from "../../components/panels/PatientActivityModal";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import {
  getAdminPatients,
  togglePatientStatus,
} from "../../data/adminMockData";

export default function PatientManagement() {
  const [patients, setPatients] = useState(getAdminPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selectedPatientForActivity, setSelectedPatientForActivity] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const plans = ["All", "Basic", "Standard", "Premium"];
  const statuses = ["All", "Active", "Deactivated"];

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "All" || patient.plan === selectedPlan;
    const matchesStatus = selectedStatus === "All" || patient.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleOpenActivity = (patient) => {
    setSelectedPatientForActivity(patient);
    setIsActivityModalOpen(true);
  };

  const handleOpenHistory = (patient) => {
    setSelectedPatientForHistory(patient);
    setIsHistoryModalOpen(true);
  };

  const handleToggleStatus = (patientId) => {
    const updated = togglePatientStatus(patientId);
    setPatients(updated);
    if (selectedPatientForActivity && selectedPatientForActivity.id === patientId) {
      const refreshed = updated.find((p) => p.id === patientId);
      if (refreshed) setSelectedPatientForActivity(refreshed);
    }
  };

  const activeCount = patients.filter((p) => p.status === "Active").length;
  const deactivatedCount = patients.filter((p) => p.status === "Deactivated").length;

  return (
    <PanelLayout
      role="admin"
      title="Patient Management"
      subtitle="View registered patient records, filter health plans, activate or deactivate user accounts, and audit real-time activity logs."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Total Enrolled Patients</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{patients.length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Active Patient Accounts</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Deactivated Accounts</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{deactivatedCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, email, phone, city..."
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
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {plans.map((p) => (
                  <option key={p} value={p}>
                    {p} Plan
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              {filteredPatients.length} Patients
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => {
            const isActive = patient.status === "Active";

            return (
              <article
                key={patient.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {patient.avatar ? (
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                          {patient.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">{patient.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{patient.city}</span>
                          <span>•</span>
                          <span>{patient.age} yrs, {patient.gender}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          patient.plan === "Premium"
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : patient.plan === "Standard"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {patient.plan}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs text-slate-600">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Email:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[170px]">{patient.email}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Phone:</span>
                      <span className="font-bold text-slate-800">{patient.phone}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Blood Group:</span>
                      <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {patient.bloodGroup || "O+"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Total Encounters:</span>
                      <span className="font-black text-purple-700">{patient.totalVisits || 0} visits</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Last Active:</span>
                      <span className="text-slate-500 font-medium">{patient.lastActive}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenActivity(patient)}
                      className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Account Activity</span>
                    </button>
                    <button
                      onClick={() => handleOpenHistory(patient)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Medical History</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(patient.id)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      isActive
                        ? "bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border-red-200"
                        : "bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Deactivate Patient Account</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Activate Patient Account</span>
                      </>
                    )}
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
              No patient records match your current search query or active filter.
            </p>
          </div>
        )}
      </div>

      <PatientActivityModal
        patient={selectedPatientForActivity}
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onToggleStatus={handleToggleStatus}
      />

      <PatientHistoryModal
        patient={selectedPatientForHistory}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </PanelLayout>
  );
}
