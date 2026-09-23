import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Users,
  Pill,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  Sparkles,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import GrowthAnalyticsChart from "../../components/panels/GrowthAnalyticsChart";
import DoctorHistoryModal from "../../components/panels/DoctorHistoryModal";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import AddMedicineModal from "../../components/panels/AddMedicineModal";
import {
  getDoctors,
  getPatients,
  getMedicines,
  addMedicine,
  revenueGrowthStats,
} from "../../data/mockData";

export default function AdminDashboard() {
  const [doctors] = useState(getDoctors);
  const [patients] = useState(getPatients);
  const [medicines, setMedicines] = useState(getMedicines);

  // Modals state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  const handleOpenDoctorHistory = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleOpenPatientHistory = (patient) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  const handleAddMedicine = (newMed) => {
    const updated = addMedicine(newMed);
    setMedicines(updated);
  };

  return (
    <PanelLayout
      role="admin"
      title="Admin Command Center"
      subtitle="Comprehensive control of doctor rosters, patient records, revenue streams, and pharmacy inventory."
    >
      <div className="space-y-8">
        {/* Quick Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-slate-900 p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sky-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Medicare System V2.0 Active
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Hospital Network Operations
              </h2>
              <p className="text-sky-100 text-xs sm:text-sm leading-relaxed">
                Monitor doctors consultation records, patient health timelines, and add medicines directly to the centralized pharmacy catalog.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddMedModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-sky-50 text-sm font-bold shadow-md transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-sky-600" />
                <span>Add Medicine</span>
              </button>
              <Link
                to="/admin/doctors"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 backdrop-blur-xs transition flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Roster</span>
              </Link>
            </div>
          </div>
          {/* Decorative background shapes */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Growth & Revenue Analytics Section */}
        <GrowthAnalyticsChart />

        {/* Doctors and Patients Double Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctors Section with History View */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Doctors Network</h3>
                    <p className="text-xs text-slate-500">Verified medical practitioners & specialties</p>
                  </div>
                </div>
                <Link
                  to="/admin/doctors"
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <span>View All ({doctors.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {doctors.slice(0, 4).map((doctor) => (
                  <div
                    key={doctor.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-2xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.avatar}
                        alt={doctor.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{doctor.name}</p>
                        <p className="text-xs text-slate-500">
                          {doctor.specialty} • {doctor.experience}y exp
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDoctorHistory(doctor)}
                        className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Doctor History</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{revenueGrowthStats.activeDoctors} Active doctors in Medicare database</span>
              <Link to="/admin/doctors" className="font-semibold text-sky-600 hover:underline">
                Manage Doctors
              </Link>
            </div>
          </div>

          {/* Patients Section with History View */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Patients Directory</h3>
                    <p className="text-xs text-slate-500">Active accounts and medical encounter logs</p>
                  </div>
                </div>
                <Link
                  to="/admin/patients"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>View All ({patients.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {patients.slice(0, 4).map((patient) => (
                  <div
                    key={patient.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-2xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{patient.name}</p>
                        <p className="text-xs text-slate-500">
                          {patient.age}y, {patient.gender} • Blood {patient.bloodGroup}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenPatientHistory(patient)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Patient History</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>{revenueGrowthStats.totalPatients.toLocaleString()} Registered patients</span>
              <Link to="/admin/patients" className="font-semibold text-emerald-600 hover:underline">
                Manage Patients
              </Link>
            </div>
          </div>
        </div>

        {/* Pharmacy & Medicine Inventory Snapshot */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Pharmacy Catalog & Stock</h3>
                <p className="text-xs text-slate-500">Live pharmaceutical inventory and medicine dispensing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddMedModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
              <Link
                to="/admin/medicines"
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
              >
                Full Medicine Inventory
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Medicine</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stock Units</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Manufacturer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.slice(0, 5).map((med) => {
                  const isLow = med.stock < 200;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {med.name}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {med.genericName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{med.category}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-900">{med.stock} units</td>
                      <td className="px-4 py-3 text-xs font-bold text-emerald-600">${med.unitPrice}</td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                            isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isLow ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right text-slate-500">{med.manufacturer}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* History Modals */}
      <DoctorHistoryModal
        doctor={selectedDoctor}
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />

      <PatientHistoryModal
        patient={selectedPatient}
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
      />

      <AddMedicineModal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />
    </PanelLayout>
  );
}
