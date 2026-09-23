import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Stethoscope, Star, MapPin, Award, Eye, Calendar, Plus, Sparkles, Phone, Mail } from "lucide-react";
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
      title="Medical Specialists & Clinical History"
      subtitle="Supervise active practitioners, clinical credentials, consultation ratings, and inspect complete patient consultation histories."
    >
      <div className="space-y-6">
        {/* Search & Specialty Filter Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by specialist name, clinic, or city..."
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
                className="px-3.5 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              {filteredDoctors.length} Specialists
            </span>
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => {
            const historyCount = doctor.consultationHistory?.length || 0;
            return (
              <article
                key={doctor.id || doctor.name}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={
                          doctor.avatar ||
                          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                        }
                        alt={doctor.name}
                        className="w-18 h-18 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-start justify-between gap-1">
                        <h2 className="text-lg font-extrabold text-slate-900 leading-snug truncate">
                          {doctor.name}
                        </h2>
                        <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {doctor.rating}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-purple-700 mt-0.5">{doctor.specialty}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{doctor.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Clinic Facility:</span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[170px]">
                        {doctor.clinic}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Experience:</span>
                      <span className="font-bold text-slate-800">{doctor.experience} years practice</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Consultation Fee:</span>
                      <span className="font-black text-emerald-600">{doctor.fee || "$75"}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Logged Consults:</span>
                      <span className="font-extrabold text-purple-700">{historyCount} cases recorded</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      doctor.status === "Available"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {doctor.status || "Available"}
                  </span>

                  <button
                    onClick={() => handleOpenHistory(doctor)}
                    className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs group-hover:bg-purple-600 group-hover:text-white"
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
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No doctors found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No medical specialists match your search criteria. Try a different specialty filter.
            </p>
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
