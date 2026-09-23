import React, { useState } from "react";
import { Users, Search, Eye, FileText, Activity, AlertTriangle, MapPin, Mail, Phone } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import PrescriptionModal from "../../components/panels/PrescriptionModal";
import { getPatients, getDoctors } from "../../data/mockData";

export default function DoctorPatients() {
  const [patients] = useState(getPatients);
  const doctors = getDoctors();
  const currentDoctor = doctors[0];
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState(null);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  const filteredPatients = patients.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.chronicConditions && p.chronicConditions.join(" ").toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleOpenHistory = (patient) => {
    setSelectedPatientForHistory(patient);
    setIsHistoryOpen(true);
  };

  const handleOpenPrescription = (patient) => {
    setSelectedPatientForPrescription(patient);
    setIsPrescriptionOpen(true);
  };

  return (
    <PanelLayout
      role="doctor"
      title="Clinical Patient Roster & Records"
      subtitle="Examine your patients' chronological medical charts, ongoing chronic therapies, allergies, and issue digital prescriptions."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patients by name, email, condition..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">
            {filteredPatients.length} Active Records
          </span>
        </div>

        {/* Patients Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPatients.map((patient) => {
            const hasAllergies = patient.allergies && patient.allergies.length > 0 && !patient.allergies.includes("None");
            return (
              <article
                key={patient.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-200 transition flex flex-col justify-between"
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
                          <span>{patient.age}y, {patient.gender}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">Blood: {patient.bloodGroup || "O+"}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {patient.plan}
                    </span>
                  </div>

                  {/* Clinical condition badges */}
                  <div className="mt-4 space-y-2 text-xs">
                    {hasAllergies && (
                      <div className="flex items-start gap-2 p-2 rounded-xl bg-red-50 text-red-700 border border-red-100">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>Allergy: {patient.allergies.join(", ")}</span>
                      </div>
                    )}
                    {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                      <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                        <Activity className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>Chronic: {patient.chronicConditions.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="flex justify-between">
                      <span>Total Consultations:</span>
                      <span className="font-bold text-slate-800">{patient.medicalHistory?.length || 0} visits</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium text-slate-700">{patient.city}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-medium text-slate-700">{patient.phone || "+91 98000 00000"}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenHistory(patient)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Chart</span>
                  </button>

                  <button
                    onClick={() => handleOpenPrescription(patient)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Prescribe</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <PatientHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        patient={selectedPatientForHistory}
      />

      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        patient={selectedPatientForPrescription}
        doctorName={currentDoctor.name}
        doctorSpecialty={currentDoctor.specialty}
      />
    </PanelLayout>
  );
}
