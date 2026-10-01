import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Video,
  Building,
  User,
  AlertTriangle,
  CalendarCheck,
  CalendarX,
  RefreshCw,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import RescheduleAppointmentModal from "../../components/panels/RescheduleAppointmentModal";
import PatientHistoryModal from "../../components/panels/PatientHistoryModal";
import {
  getDoctorAppointments,
  getDoctorPatients,
  acceptAppointment,
  rejectAppointment,
  rescheduleAppointment,
} from "../../data/doctorMockData";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState(getDoctorAppointments);
  const [patients] = useState(getDoctorPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewScope, setViewScope] = useState("today");

  const [selectedAppointmentForReschedule, setSelectedAppointmentForReschedule] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);

  const handleAccept = (id) => {
    const updated = acceptAppointment(id);
    setAppointments(updated);
  };

  const handleReject = (id) => {
    const updated = rejectAppointment(id);
    setAppointments(updated);
  };

  const handleOpenReschedule = (apt) => {
    setSelectedAppointmentForReschedule(apt);
    setIsRescheduleOpen(true);
  };

  const handleRescheduleConfirm = (id, newDate, newTime) => {
    const updated = rescheduleAppointment(id, newDate, newTime);
    setAppointments(updated);
  };

  const handleOpenPatientDetails = (patientName) => {
    const found = patients.find((p) => p.name.toLowerCase() === patientName.toLowerCase()) || patients[0];
    setSelectedPatientForDetails(found);
    setIsPatientDetailsOpen(true);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || apt.status === statusFilter;

    let matchesScope = true;
    if (viewScope === "today") {
      matchesScope = !!apt.isToday;
    } else if (viewScope === "upcoming") {
      matchesScope = !apt.isToday && apt.status !== "Completed" && apt.status !== "Cancelled";
    } else if (viewScope === "history") {
      matchesScope = apt.status === "Completed" || apt.status === "Cancelled";
    }

    return matchesSearch && matchesStatus && matchesScope;
  });

  const todayCount = appointments.filter((a) => a.isToday).length;
  const upcomingCount = appointments.filter((a) => !a.isToday && a.status !== "Completed" && a.status !== "Cancelled").length;
  const historyCount = appointments.filter((a) => a.status === "Completed" || a.status === "Cancelled").length;

  return (
    <PanelLayout
      role="doctor"
      title="Appointment Management"
      subtitle="Today's clinical schedule, upcoming bookings, accept/reject booking requests, reschedule appointments, and access patient medical records."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewScope("today")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                viewScope === "today"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Today's Visits ({todayCount})</span>
            </button>

            <button
              onClick={() => setViewScope("upcoming")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                viewScope === "upcoming"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Appointments ({upcomingCount})</span>
            </button>

            <button
              onClick={() => setViewScope("history")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                viewScope === "history"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Appointment History ({historyCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredAppointments.length} Appointments
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name, appointment #, or symptoms..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-bold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isPending = apt.status === "Pending";
            const isConfirmed = apt.status === "Confirmed";

            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={apt.patientAvatar}
                    alt={apt.patientName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{apt.patientName}</h3>
                      <span className="text-xs font-mono font-bold text-slate-400">#{apt.appointmentNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          apt.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : apt.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : apt.status === "Completed"
                            ? "bg-sky-100 text-sky-800 border-sky-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      {apt.patientAge} yrs, {apt.patientGender} • Ph: {apt.patientPhone}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {apt.date} at {apt.time}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                        {apt.type === "Video Call" ? <Video className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                        {apt.type} ({apt.room})
                      </span>
                      <span>•</span>
                      <span className="font-black text-emerald-600">{apt.fee}</span>
                    </div>

                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl mt-1">
                      <strong>Clinical Symptoms / Notes:</strong> {apt.symptoms}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => handleOpenPatientDetails(apt.patientName)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Patient Details</span>
                  </button>

                  <button
                    onClick={() => handleOpenReschedule(apt)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reschedule</span>
                  </button>

                  {isPending && (
                    <>
                      <button
                        onClick={() => handleAccept(apt.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(apt.id)}
                        className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {isConfirmed && (
                    <Link
                      to="/doctor/consultation"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Consult</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-lg">No appointments found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No appointment records match your selected scope, keyword, or status filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <RescheduleAppointmentModal
        appointment={selectedAppointmentForReschedule}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onReschedule={handleRescheduleConfirm}
      />

      <PatientHistoryModal
        patient={selectedPatientForDetails}
        isOpen={isPatientDetailsOpen}
        onClose={() => setIsPatientDetailsOpen(false)}
      />
    </PanelLayout>
  );
}
