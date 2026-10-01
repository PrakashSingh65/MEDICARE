import React, { useState } from "react";
import {
  Stethoscope,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Edit,
  Eye,
  Star,
  MapPin,
  Building,
  Phone,
  Mail,
  Award,
  AlertTriangle,
  UserCheck,
  Plus,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import DoctorVerificationModal from "../../components/panels/DoctorVerificationModal";
import DoctorEditModal from "../../components/panels/DoctorEditModal";
import DoctorHistoryModal from "../../components/panels/DoctorHistoryModal";
import {
  getAdminDoctors,
  approveDoctor,
  rejectDoctor,
  toggleDoctorStatus,
  updateDoctorInfo,
  verifyDoctorDocument,
} from "../../data/adminMockData";

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState(getAdminDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [selectedDoctorForVerify, setSelectedDoctorForVerify] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedDoctorForHistory, setSelectedDoctorForHistory] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];
  const statuses = ["All", "Active", "Pending", "Suspended", "Rejected"];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    const matchesStatus =
      selectedStatus === "All" || doc.status === selectedStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const handleOpenVerify = (doctor) => {
    setSelectedDoctorForVerify(doctor);
    setIsVerifyModalOpen(true);
  };

  const handleOpenEdit = (doctor) => {
    setSelectedDoctorForEdit(doctor);
    setIsEditModalOpen(true);
  };

  const handleOpenHistory = (doctor) => {
    setSelectedDoctorForHistory(doctor);
    setIsHistoryModalOpen(true);
  };

  const handleVerifyDoc = (doctorId, docId) => {
    const updated = verifyDoctorDocument(doctorId, docId);
    setDoctors(updated);
    const refreshed = updated.find((d) => d.id === doctorId);
    if (refreshed) setSelectedDoctorForVerify(refreshed);
  };

  const handleApprove = (doctorId) => {
    const updated = approveDoctor(doctorId);
    setDoctors(updated);
  };

  const handleReject = (doctorId, reason) => {
    const updated = rejectDoctor(doctorId, reason);
    setDoctors(updated);
  };

  const handleToggleStatus = (doctor) => {
    const nextStatus = doctor.status === "Active" ? "Suspended" : "Active";
    const updated = toggleDoctorStatus(doctor.id, nextStatus);
    setDoctors(updated);
  };

  const handleSaveEdit = (doctorId, fields) => {
    const updated = updateDoctorInfo(doctorId, fields);
    setDoctors(updated);
  };

  const pendingCount = doctors.filter((d) => d.verificationStatus === "Pending" || d.status === "Pending").length;
  const activeCount = doctors.filter((d) => d.status === "Active").length;
  const suspendedCount = doctors.filter((d) => d.status === "Suspended").length;

  return (
    <PanelLayout
      role="admin"
      title="Doctor Management"
      subtitle="Supervise medical practitioners, approve registrations, verify degrees, toggle account statuses, and update clinic profiles."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Total Specialists</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{doctors.length}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Active & Practicing</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{activeCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Pending Verification</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">{pendingCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Suspended Accounts</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{suspendedCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
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
              placeholder="Search by name, clinic, qualification, or city..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-bold">Specialty:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
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
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              {filteredDoctors.length} Doctors
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => {
            const isPending = doctor.verificationStatus === "Pending" || doctor.status === "Pending";
            const isSuspended = doctor.status === "Suspended";

            return (
              <article
                key={doctor.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            doctor.status === "Active"
                              ? "bg-emerald-500"
                              : doctor.status === "Pending"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {doctor.name}
                        </h3>
                        <p className="text-xs font-bold text-purple-700 mt-0.5">{doctor.specialty}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{doctor.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          doctor.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : doctor.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {doctor.status}
                      </span>
                      <span className="flex items-center gap-0.5 text-xs font-black text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {doctor.rating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs text-slate-600">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Qualification:</span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[170px]">
                        {doctor.qualification}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Clinic Facility:</span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[170px]">
                        {doctor.clinic}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Experience & Fee:</span>
                      <span className="font-bold text-slate-800">
                        {doctor.experience} yrs • <span className="text-emerald-600 font-black">{doctor.fee}</span>
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Verification:</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          doctor.verificationStatus === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {doctor.verificationStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenVerify(doctor)}
                      className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify Credentials</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit(doctor)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleToggleStatus(doctor)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                        isSuspended
                          ? "bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border-emerald-200"
                          : "bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border-red-200"
                      }`}
                    >
                      {isSuspended ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Activate Doctor</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Suspend Doctor</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenHistory(doctor)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>History</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No doctors found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No medical specialists match the active search or filter criteria.
            </p>
          </div>
        )}
      </div>

      <DoctorVerificationModal
        doctor={selectedDoctorForVerify}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerifyDoc={handleVerifyDoc}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <DoctorEditModal
        doctor={selectedDoctorForEdit}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <DoctorHistoryModal
        doctor={selectedDoctorForHistory}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </PanelLayout>
  );
}
