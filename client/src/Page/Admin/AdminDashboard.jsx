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
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
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
      title="Admin Command & Clinical Intelligence"
      subtitle="Complete supervisory oversight over all doctors, patients, revenue streams, growth rates, and pharmacy inventory."
    >
      <div className="space-y-8">
        {/* Dynamic Hero Operations Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-purple-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold backdrop-blur-md border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Medicare Enterprise Central Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Hospital Network & Fiscal Intelligence
              </h2>
              <p className="text-purple-100/80 text-xs sm:text-sm leading-relaxed">
                Seamlessly supervise <strong className="text-white">24 specialists</strong>, audit patient clinical encounters, add pharmaceutical drugs to central inventory, and track <strong className="text-white">+18.4% platform growth</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddMedModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-purple-50 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg transition flex items-center gap-2 group"
              >
                <Plus className="w-4 h-4 text-purple-600 group-hover:rotate-90 transition-transform duration-200" />
                <span>Add Medicine</span>
              </button>
              <Link
                to="/admin/doctors"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Directory</span>
              </Link>
            </div>
          </div>
          {/* Decorative background blurs */}
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Growth & Revenue Section */}
        <GrowthAnalyticsChart />

        {/* Dual Grid: Doctors & Patients Directories with History Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Doctors Roster */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Doctors Network</h3>
                    <p className="text-xs text-slate-400">Clinical specialists & case volume</p>
                  </div>
                </div>
                <Link
                  to="/admin/doctors"
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
                >
                  <span>View All ({doctors.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="space-y-3">
                {doctors.slice(0, 4).map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-sky-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-white shadow-xs"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-snug">{doctor.name}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {doctor.specialty} • {doctor.experience}y exp
                        </p>
                        <p className="text-[11px] text-amber-600 font-bold mt-0.5">
                          ★ {doctor.rating} ({doctor.patientsCount} patients)
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenDoctorHistory(doctor)}
                      className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{revenueGrowthStats.activeDoctors} Specialists registered</span>
              <Link to="/admin/doctors" className="font-bold text-sky-600 hover:underline">
                Manage Specialists
              </Link>
            </div>
          </div>

          {/* Patients Directory */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Patients Directory</h3>
                    <p className="text-xs text-slate-400">Health plans & electronic records</p>
                  </div>
                </div>
                <Link
                  to="/admin/patients"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
                >
                  <span>View All ({patients.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="space-y-3">
                {patients.slice(0, 4).map((patient) => (
                  <div
                    key={patient.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm leading-snug">{patient.name}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {patient.plan}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {patient.age}y, {patient.gender} • Blood {patient.bloodGroup}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {patient.medicalHistory?.length || 0} consultations logged
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPatientHistory(patient)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{revenueGrowthStats.totalPatients.toLocaleString()} Registered accounts</span>
              <Link to="/admin/patients" className="font-bold text-emerald-600 hover:underline">
                Manage Patients
              </Link>
            </div>
          </div>
        </div>

        {/* Pharmacy & Medicine Inventory Snapshot */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Central Medicine Repository</h3>
                <p className="text-xs text-slate-400">Real-time inventory stock levels & price catalog</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddMedModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
              <Link
                to="/admin/medicines"
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
              >
                Full Pharmacy
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3 rounded-l-2xl">Drug Name & Formula</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">In Stock</th>
                  <th className="px-5 py-3">Unit Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 rounded-r-2xl text-right">Manufacturer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicines.slice(0, 5).map((med) => {
                  const isLow = med.stock < 200;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {med.name}
                        <span className="block text-xs text-slate-400 font-normal">
                          {med.genericName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">{med.category}</td>
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-900">{med.stock} units</td>
                      <td className="px-5 py-3.5 text-xs font-black text-emerald-600">${med.unitPrice}</td>
                      <td className="px-5 py-3.5 text-xs">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            isLow
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {isLow ? (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>In Stock</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-right text-slate-500 font-medium">
                        {med.manufacturer}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* History Inspection Modals */}
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
