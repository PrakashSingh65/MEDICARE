import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Edit3,
  CheckCircle,
  Save,
  X,
  Camera,
  AlertCircle,
  FileCheck,
  Sparkles
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import { getPatientProfile, savePatientProfile, syncPatientProfile } from "../../data/patientMockData";

export default function PatientProfile() {
  const [profile, setProfile] = useState(getPatientProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    syncPatientProfile().then((data) => {
      if (data) {
        setProfile(data);
        setFormData(data);
      }
    });
  }, []);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const calculateAge = (dob) => {
    if (!dob) return 29;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "heightCm" || field === "weightKg") {
        const h = field === "heightCm" ? Number(value) : Number(prev.heightCm);
        const w = field === "weightKg" ? Number(value) : Number(prev.weightKg);
        if (h > 0 && w > 0) {
          const bmiVal = (w / ((h / 100) * (h / 100))).toFixed(1);
          updated.bmi = Number(bmiVal);
        }
      }
      return updated;
    });
  };

  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    if (!formData.allergies.includes(newAllergy.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
    }
    setNewAllergy("");
  };

  const handleRemoveAllergy = (allergy) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy)
    }));
  };

  const handleAddCondition = (e) => {
    e.preventDefault();
    if (!newCondition.trim()) return;
    if (!formData.chronicConditions.includes(newCondition.trim())) {
      setFormData((prev) => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, newCondition.trim()]
      }));
    }
    setNewCondition("");
  };

  const handleRemoveCondition = (condition) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((c) => c !== condition)
    }));
  };

  const handleSave = () => {
    const updated = savePatientProfile(formData);
    setProfile(updated);
    setIsEditing(false);
    setSuccessMessage("Your profile information has been successfully updated.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const handlePhotoUploadSim = () => {
    const newAvatar = window.prompt("Enter new Profile Photo URL (or leave default for preview):", formData.avatar);
    if (newAvatar) {
      handleInputChange("avatar", newAvatar);
    }
  };

  return (
    <PanelLayout
      role="patient"
      title="Personal Health Profile & Demographics"
      subtitle="Manage your identification, verified contact channels, emergency contacts, address, and physical health baseline."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-100/60 via-cyan-50/30 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group">
                <img
                  src={isEditing ? formData.avatar : profile.avatar}
                  alt={profile.name}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md ring-2 ring-sky-100"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={handlePhotoUploadSim}
                    className="absolute inset-0 bg-slate-900/50 hover:bg-slate-900/70 text-white rounded-3xl flex flex-col items-center justify-center gap-1 transition text-[11px] font-bold"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Change</span>
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/60">
                    ID: {profile.id}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {profile.plan}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1 flex-wrap">
                  <span>Age: {calculateAge(profile.dateOfBirth)} yrs</span>
                  <span>•</span>
                  <span>Gender: {profile.gender}</span>
                  <span>•</span>
                  <span className="text-rose-600 font-bold">Blood Group: {profile.bloodGroup}</span>
                  <span>•</span>
                  <span>BMI: {profile.bmi}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-slate-900">{profile.email}</p>
              </div>
            </div>
            {profile.isEmailVerified ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            ) : (
              <Link
                to="/verify"
                className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
              >
                Verify Now
              </Link>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile Phone</p>
                <p className="text-sm font-bold text-slate-900">{profile.phone}</p>
              </div>
            </div>
            {profile.isPhoneVerified ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            ) : (
              <Link
                to="/verify"
                className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
              >
                Verify Now
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Demographic & Basic Information</h3>
                  <p className="text-xs text-slate-500">Official medical identity record</p>
                </div>
                <User className="w-5 h-5 text-slate-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Legal Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Gender</label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900 bg-white"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs">
                      {profile.bloodGroup}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Height (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.heightCm || ""}
                      onChange={(e) => handleInputChange("heightCm", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.heightCm || 165} cm</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Weight (kg)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.weightKg || ""}
                      onChange={(e) => handleInputChange("weightKg", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.weightKg || 58} kg</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Residential Address</h3>
                  <p className="text-xs text-slate-500">Location for home delivery and local specialist referrals</p>
                </div>
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Postal Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold text-slate-900"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-900 py-1.5">{profile.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-rose-50/70 rounded-3xl border border-rose-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-950">Emergency Contact</h3>
                  <p className="text-[11px] text-rose-700">First respondent in clinical alerts</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Contact Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  ) : (
                    <p className="text-sm font-bold text-rose-950">{profile.emergencyContactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Relationship
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContactRelation}
                      onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  ) : (
                    <p className="text-xs font-bold text-rose-800">{profile.emergencyContactRelation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Emergency Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-xs font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  ) : (
                    <a
                      href={`tel:${profile.emergencyContactPhone}`}
                      className="text-xs font-black text-rose-700 hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {profile.emergencyContactPhone}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-slate-900">Known Allergies</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {(isEditing ? formData.allergies : profile.allergies).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200/60"
                  >
                    <span>{item}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(item)}
                        className="hover:text-red-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <form onSubmit={handleAddAllergy} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. Latex"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Chronic Conditions</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {(isEditing ? formData.chronicConditions : profile.chronicConditions).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60"
                  >
                    <span>{item}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(item)}
                        className="hover:text-amber-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <form onSubmit={handleAddCondition} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. Asthma"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
