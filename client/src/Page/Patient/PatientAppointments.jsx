import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Plus,
  Stethoscope,
  Search,
  Filter,
  Star,
  MapPin,
  Bell,
  BellOff,
  Video,
  Phone,
  Building,
  CheckCircle2,
  CalendarX,
  RefreshCw,
  Eye,
  ArrowRight,
  ShieldCheck,
  Activity
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import DoctorProfileModal from "../../components/panels/DoctorProfileModal";
import PatientBookModal from "../../components/panels/PatientBookModal";
import RescheduleAppointmentModal from "../../components/panels/RescheduleAppointmentModal";
import CancelAppointmentModal from "../../components/panels/CancelAppointmentModal";
import {
  getAvailableDoctors,
  getPatientAppointments,
  cancelPatientAppointment,
  reschedulePatientAppointment,
  toggleAppointmentReminder,
  syncPatientAppointments,
  syncPatientDoctors,
} from "../../data/patientMockData";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState(getPatientAppointments);
  const [doctors, setDoctors] = useState(getAvailableDoctors);

  useEffect(() => {
    syncPatientAppointments().then((data) => {
      if (data && Array.isArray(data)) setAppointments(data);
    });
    syncPatientDoctors().then((data) => {
      if (data && Array.isArray(data)) setDoctors(data);
    });
  }, []);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("All");

  const [selectedDoctorForProfile, setSelectedDoctorForProfile] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookPreselectedDoctor, setBookPreselectedDoctor] = useState(null);
  const [bookPreselectedSlot, setBookPreselectedSlot] = useState(null);

  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const specialties = [
    "All",
    "Cardiology",
    "General Medicine",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics"
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchSpecialty.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchSpecialty.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(searchSpecialty.toLowerCase());
    const matchesCategory =
      selectedSpecialtyFilter === "All" || doc.specialty === selectedSpecialtyFilter;
    return matchesSearch && matchesCategory;
  });

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "Confirmed" || apt.status === "Pending"
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status === "Completed" || apt.status === "Cancelled"
  );

  const handleOpenDoctorProfile = (doc) => {
    setSelectedDoctorForProfile(doc);
    setIsProfileModalOpen(true);
  };

  const handleOpenBooking = (doc = null, slot = null) => {
    setBookPreselectedDoctor(doc);
    setBookPreselectedSlot(slot);
    setIsBookModalOpen(true);
  };

  const handleBookFromProfile = (doc, slot) => {
    setIsProfileModalOpen(false);
    handleOpenBooking(doc, slot);
  };

  const handleToggleReminder = (id) => {
    const updated = toggleAppointmentReminder(id);
    setAppointments([...updated]);
  };

  const handleOpenReschedule = (apt) => {
    setSelectedAppointmentForReschedule(apt);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = (id, newDate, newTime) => {
    const updated = reschedulePatientAppointment(id, newDate, newTime, "Patient requested reschedule");
    setAppointments([...updated]);
  };

  const handleOpenCancel = (apt) => {
    setSelectedAppointmentForCancel(apt);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (id, reason) => {
    const updated = cancelPatientAppointment(id, reason);
    setAppointments([...updated]);
  };

  const handleAppointmentBooked = () => {
    setAppointments(getPatientAppointments());
    syncPatientAppointments().then((data) => {
      if (data && Array.isArray(data)) setAppointments(data);
    });
  };

  return (
    <PanelLayout
      role="patient"
      title="Appointments & Specialist Scheduling"
      subtitle="Search accredited doctors by specialty, explore available time slots, book visits, set automated reminders, and manage your consultations."
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-sky-800 via-sky-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                Seamless Healthcare Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Connect With India's Top Medical Specialists
              </h2>
              <p className="text-xs sm:text-sm text-sky-200">
                Book secure high-definition video consultations, phone appointments, or in-clinic visits with instant confirmation and automated SMS/email reminders.
              </p>
            </div>
            <button
              onClick={() => handleOpenBooking(null, null)}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg transition shrink-0"
            >
              <Plus className="w-4 h-4 text-sky-700" />
              <span>Book An Appointment</span>
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "upcoming"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Visits</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800">
              {upcomingAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "explore"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Find Doctors & Specialties</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "history"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Appointment History</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {pastAppointments.length}
            </span>
          </button>
        </div>

        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">No Upcoming Appointments</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You do not have any pending or confirmed consultations. Select a specialty to book your next session.
                </p>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="px-5 py-2.5 rounded-2xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition"
                >
                  Find a Doctor
                </button>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-sky-300 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={apt.doctorAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"}
                      alt={apt.doctorName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-base">{apt.doctorName}</h3>
                        <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100">
                          {apt.doctorSpecialty}
                        </span>
                        <span
                          className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full ${
                            apt.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        <span className="font-bold text-slate-700">Reason: </span>
                        {apt.symptoms}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-sky-600" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-sky-600" /> {apt.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                          {apt.type === "Video Consultation" ? (
                            <Video className="w-3.5 h-3.5 text-purple-600" />
                          ) : apt.type === "Audio Consultation" ? (
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Building className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          {apt.type}
                        </span>
                        <span className="font-bold text-emerald-600">${apt.fee} Fee</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap lg:self-center">
                    <button
                      onClick={() => handleToggleReminder(apt.id)}
                      title={apt.reminderEnabled ? "Disable Reminder" : "Enable Reminder"}
                      className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition ${
                        apt.reminderEnabled
                          ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                          : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                      }`}
                    >
                      {apt.reminderEnabled ? (
                        <>
                          <Bell className="w-4 h-4 text-amber-600" />
                          <span className="text-[11px]">Reminder On</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 text-slate-400" />
                          <span className="text-[11px]">Reminder Off</span>
                        </>
                      )}
                    </button>

                    <Link
                      to="/patient/consultation"
                      className="px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Room</span>
                    </Link>

                    <button
                      onClick={() => handleOpenReschedule(apt)}
                      className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => handleOpenCancel(apt)}
                      className="px-3.5 py-2.5 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <CalendarX className="w-3.5 h-3.5 text-rose-600" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "explore" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search doctor by name, specialty, hospital..."
                    value={searchSpecialty}
                    onChange={(e) => setSearchSpecialty(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Specialties:
                </span>
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialtyFilter(spec)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                      selectedSpecialtyFilter === spec
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-sky-300 transition flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-slate-900 text-sm">{doc.name}</h3>
                          <span className="flex items-center gap-1 text-[11px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {doc.rating}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-sky-700">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-400">{doc.experience} yrs experience</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {doc.bio}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Clinic</span>
                        <span className="font-bold text-slate-800 truncate max-w-[170px]">{doc.clinic}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Consultation Fee</span>
                        <span className="font-extrabold text-emerald-600">${doc.fee}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Available Today
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.availableSlots?.slice(0, 3).map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleOpenBooking(doc, slot)}
                            className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-100 transition"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenDoctorProfile(doc)}
                      className="px-3 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={() => handleOpenBooking(doc, null)}
                      className="px-3 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Visit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
                No past appointment records found.
              </div>
            ) : (
              pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold shrink-0">
                      <Stethoscope className="w-6 h-6 text-slate-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-sm">{apt.doctorName}</h4>
                        <span className="text-xs font-bold text-slate-500 px-2.5 py-0.5 rounded-full bg-slate-100">
                          {apt.doctorSpecialty}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            apt.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-700">Diagnosis / Notes: </strong>
                        {apt.diagnosis || apt.symptoms}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>Visited: {apt.date} at {apt.time}</span>
                        <span>•</span>
                        <span>Fee Paid: ${apt.fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    <Link
                      to="/patient/prescriptions"
                      className="px-4 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <span>View Prescriptions</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <DoctorProfileModal
        doctor={selectedDoctorForProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSelectSlot={handleBookFromProfile}
      />

      <PatientBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        preselectedDoctor={bookPreselectedDoctor}
        preselectedSlot={bookPreselectedSlot}
        onSuccess={handleAppointmentBooked}
      />

      <RescheduleAppointmentModal
        appointment={selectedAppointmentForReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onReschedule={handleConfirmReschedule}
      />

      <CancelAppointmentModal
        appointment={selectedAppointmentForCancel}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onCancelConfirm={handleConfirmCancel}
      />
    </PanelLayout>
  );
}
