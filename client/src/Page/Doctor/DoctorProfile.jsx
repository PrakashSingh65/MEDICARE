import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  ShieldCheck,
  Building,
  Award,
  Globe,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Edit,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import { getDoctorProfile, saveDoctorProfile, syncDoctorProfile } from "../../data/doctorMockData";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(getDoctorProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    syncDoctorProfile().then((data) => {
      if (data) {
        setProfile(data);
        setFormData(data);
      }
    });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = saveDoctorProfile(formData);
    setProfile(updated);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLanguageToggle = (lang) => {
    const current = formData.availableLanguages || [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setFormData({ ...formData, availableLanguages: updated });
  };

  const languageOptions = ["English", "Hindi", "Kannada", "Tamil", "Telugu", "Marathi", "Bengali", "Malayalam", "Spanish", "French"];

  return (
    <PanelLayout
      role="doctor"
      title="Doctor Professional Profile"
      subtitle="View and update your clinical credentials, medical specialization, practice facility, consultation fees, and spoken languages."
    >
      <div className="space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Doctor professional profile updated and synced successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{profile.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {profile.verificationStatus}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-emerald-700">{profile.title}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {profile.clinicName} • {profile.experience} years clinical practice
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs self-start sm:self-center"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? "View Mode" : "Edit Profile"}</span>
            </button>
          </div>

          {!isEditing ? (
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Specialization</span>
                  <p className="text-xs font-black text-slate-900">{profile.specialization}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consultation Fee</span>
                  <p className="text-xs font-black text-emerald-600">{profile.consultationFee} / session</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medical Council Reg.</span>
                  <p className="text-xs font-mono font-bold text-purple-700">{profile.mciRegistrationNumber}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">State Authority</span>
                  <p className="text-xs font-bold text-slate-800">{profile.stateMedicalCouncil}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Qualifications & Degrees</h3>
                <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  {profile.qualifications}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Clinic / Hospital Information</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs text-slate-700">
                  <p className="font-extrabold text-slate-900">{profile.clinicName}</p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{profile.clinicAddress}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-1 text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {profile.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Available Spoken Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.availableLanguages?.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Professional Bio & Practice Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {profile.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Honors & Clinical Awards
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {profile.awards?.map((award, i) => (
                      <li key={i}>{award}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    Collegiate Memberships
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {profile.memberships?.map((mem, i) => (
                      <li key={i}>{mem}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="pt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Professional Clinical Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Medical Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Consultation Fee</label>
                  <input
                    type="text"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">MCI / NMC Registration Number</label>
                  <input
                    type="text"
                    value={formData.mciRegistrationNumber}
                    onChange={(e) => setFormData({ ...formData, mciRegistrationNumber: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Qualifications & Degrees</label>
                  <input
                    type="text"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Clinic / Hospital Name</label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Facility Address</label>
                  <input
                    type="text"
                    value={formData.clinicAddress}
                    onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Available Spoken Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((lang) => {
                      const selected = (formData.availableLanguages || []).includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            selected
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Professional Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...profile });
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
