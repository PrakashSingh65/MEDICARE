import React from "react";
import { X, Calendar, Star, DollarSign, UserCheck, ShieldAlert, Award, Stethoscope, MapPin, Mail, Phone } from "lucide-react";

export default function DoctorHistoryModal({ doctor, isOpen, onClose }) {
  if (!isOpen || !doctor) return null;

  const consultationHistory = doctor.consultationHistory || [];
  const totalEarnings = consultationHistory.reduce((sum, item) => sum + (item.fee || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <img
              src={doctor.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                  {doctor.specialty}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {doctor.location}</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-slate-400" /> {doctor.experience} yrs exp</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold"><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {doctor.rating}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500">Consultation Fee</span>
              <p className="text-lg font-bold text-slate-900 mt-1">{doctor.fee || "$75"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500">Total Patients</span>
              <p className="text-lg font-bold text-sky-600 mt-1">{doctor.patientsCount || 0}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500">Recorded Cases</span>
              <p className="text-lg font-bold text-indigo-600 mt-1">{consultationHistory.length}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500">Logged Revenue</span>
              <p className="text-lg font-bold text-emerald-600 mt-1">${totalEarnings}</p>
            </div>
          </div>

          {/* Doctor Credentials & Bio */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>Clinical Profile & Education</span>
            </div>
            <p className="font-medium text-slate-900 text-xs sm:text-sm">{doctor.qualification || "MBBS, MD - Specialization"}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{doctor.bio || "Practicing specialist committed to compassionate, evidence-based patient healthcare delivery."}</p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-200/60 mt-2">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {doctor.email || "doctor@medicare.com"}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {doctor.phone || "+91 98000 00000"}</span>
            </div>
          </div>

          {/* Consultation History Log */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Doctor Consultation & Patient History</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">{consultationHistory.length} Recorded Visits</span>
            </div>

            {consultationHistory.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <UserCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">No past patient consultations logged yet.</p>
                <p className="text-xs text-slate-400 mt-1">New consultation sessions will automatically show here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consultationHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-sky-200 hover:shadow-xs transition space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{item.patientName}</span>
                        <span className="text-xs text-slate-400">({item.patientId || "Patient"})</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-500">{item.date}</span>
                        <span className="font-semibold text-emerald-600">${item.fee || 75}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                          {item.status || "Completed"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="font-medium text-slate-700">Diagnosis: </span>
                        <span className="text-slate-600">{item.diagnosis}</span>
                      </p>
                      <p>
                        <span className="font-medium text-slate-700">Prescribed Treatment: </span>
                        <span className="text-slate-600">{item.treatment}</span>
                      </p>
                    </div>
                    {item.rating && (
                      <div className="pt-2 border-t border-slate-50 flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Patient Feedback: {item.rating} / 5.0</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 text-sm transition"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
}
