import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Stethoscope, Star, MapPin, Award, Eye, Calendar, Plus } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import DoctorHistoryModal from "../../components/panels/DoctorHistoryModal";
import { getDoctors } from "../../data/mockData";

export default function Doctorlist() {
  const [doctors] = useState(getDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const specialties = ["All", ...new Set(doctors.map((d) => d.specialty))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleOpenHistory = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <PanelLayout
      role="admin"
      title="Doctors Directory & Clinical History"
      subtitle="View all registered medical specialists, clinical credentials, ratings, and inspect full consultation histories."
    >
      <div className="space-y-6">
        {/* Search & Filters */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctor by name, clinic, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Specialty:</span>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600">
              {filteredDoctors.length} Doctors Found
            </span>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => {
            const historyCount = doctor.consultationHistory?.length || 0;
            return (
              <article
                key={doctor.id || doctor.name}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        doctor.avatar ||
                        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                      }
                      alt={doctor.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <h2 className="text-lg font-bold text-slate-900 leading-snug">{doctor.name}</h2>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {doctor.rating}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-sky-600 mt-0.5">{doctor.specialty}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{doctor.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Clinic / Hospital:</span>
                      <span className="font-semibold text-slate-800 text-right">{doctor.clinic}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="font-semibold text-slate-800">{doctor.experience} years</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Consultation Fee:</span>
                      <span className="font-semibold text-emerald-600">{doctor.fee || "$75"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Recorded Consults:</span>
                      <span className="font-semibold text-indigo-600">{historyCount} cases</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      doctor.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {doctor.status || "Available"}
                  </span>
                  <button
                    onClick={() => handleOpenHistory(doctor)}
                    className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Doctor History</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Stethoscope className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No doctors match your search.</p>
            <p className="text-xs text-slate-400 mt-1">Try searching with a different name or specialty filter.</p>
          </div>
        )}
      </div>

      {/* Doctor History Modal */}
      <DoctorHistoryModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PanelLayout>
  );
}
