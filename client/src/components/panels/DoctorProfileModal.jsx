import React from "react";
import { X, Star, ShieldCheck, MapPin, Building, Globe, Award, DollarSign, Calendar, Clock } from "lucide-react";

export default function DoctorProfileModal({ doctor, isOpen, onClose, onSelectSlot }) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-sky-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg leading-tight">{doctor.name}</h3>
                <span className="flex items-center gap-1 text-[11px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  {doctor.rating} ({doctor.reviewsCount || 100})
                </span>
              </div>
              <p className="text-xs text-sky-200 font-bold mt-0.5">{doctor.specialty}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
              <span className="font-extrabold text-slate-900 text-sm">{doctor.experience} Years Practice</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
              <span className="font-black text-emerald-600 text-sm">${doctor.fee} / visit</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification</span>
              <span className="font-bold text-sky-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Verified Practitioner
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-sky-600" />
              Practice Facility & Clinic
            </h4>
            <p className="font-bold text-slate-800">{doctor.clinic}</p>
            <p className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{doctor.location}</span>
            </p>
          </div>

          <div className="space-y-1 text-xs text-slate-600">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Degrees & Qualifications</span>
            <p className="font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">{doctor.qualifications}</p>
          </div>

          <div className="space-y-1 text-xs text-slate-600">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Languages Spoken</span>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {doctor.languages?.map((lang) => (
                <span key={lang} className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 font-bold text-xs flex items-center gap-1">
                  <Globe className="w-3 h-3 text-sky-600" />
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs text-slate-600">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Professional Bio</span>
            <p className="leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700">{doctor.bio}</p>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Available Time Slots:
            </span>
            <div className="flex flex-wrap gap-2">
              {doctor.availableSlots?.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    onSelectSlot(doctor, slot);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 border border-sky-200 text-xs font-bold transition shadow-2xs"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
