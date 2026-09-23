import React, { useState } from "react";
import { Calendar, Search, Filter, Clock, Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import PrescriptionModal from "../../components/panels/PrescriptionModal";
import { getAppointments, getPatients, updateAppointmentStatus, getDoctors } from "../../data/mockData";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(getAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const patients = getPatients();
  const doctors = getDoctors();
  const currentDoctor = doctors[0];

  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const handleStatusChange = (id, newStatus) => {
    const updated = updateAppointmentStatus(id, newStatus);
    setAppointments([...updated]);
  };

  const handleOpenHistory = (patientName) => {
    const patientObj = patients.find((p) => p.name.toLowerCase() === patientName.toLowerCase()) || patients[0];
    setSelectedPatientForHistory(patientObj);
    setIsHistoryModalOpen(true);
  };

  const handleOpenPrescription = (patientName) => {
    const patientObj = patients.find((p) => p.name.toLowerCase() === patientName.toLowerCase()) || patients[0];
    setSelectedPatientForPrescription(patientObj);
    setIsPrescriptionModalOpen(true);
  };

  const statuses = ["All", "Confirmed", "Pending", "Completed"];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || apt.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <PanelLayout
      role="doctor"
      title="Appointment Management & Clinical Schedule"
      subtitle="Accept, reschedule, complete visits, and write digital prescriptions for patient encounters."
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
              placeholder="Search by patient name or symptom..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">
              {filteredAppointments.length} Appointments Found
            </span>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-200 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-base font-bold text-slate-900">{apt.patientName}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {apt.type}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      apt.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : apt.status === "Completed"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {apt.status}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto lg:ml-0 font-medium">
                    Consultation Fee: {apt.fee || "$50"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">Date:</span> {apt.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">Scheduled Time:</span> {apt.time}
                  </p>
                </div>

                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Reported Symptoms / Reason: </span>
                  {apt.symptoms}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 lg:flex-col lg:items-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenHistory(apt.patientName)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Patient History</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrescription(apt.patientName)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribe & Complete</span>
                  </button>
                </div>

                {apt.status === "Pending" && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleStatusChange(apt.id, "Confirmed")}
                      className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Confirm Visit</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(apt.id, "Cancelled")}
                      className="px-3 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Decline</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No appointments found matching filters.</p>
          </div>
        )}
      </div>

      <PatientHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        patient={selectedPatientForHistory}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patient={selectedPatientForPrescription}
        doctorName={currentDoctor.name}
        doctorSpecialty={currentDoctor.specialty}
        onPrescriptionSaved={() => {
          // If needed, update local state
        }}
      />
    </PanelLayout>
  );
}
