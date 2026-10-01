import React, { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  CalendarX,
  Clock,
  User,
  Stethoscope,
  Video,
  Building,
  DollarSign,
  AlertCircle,
  Eye,
  MessageSquare,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import AppointmentIssueModal from "../../components/panels/AppointmentIssueModal";
import CancelAppointmentModal from "../../components/panels/CancelAppointmentModal";
import {
  getAdminAppointments,
  cancelAdminAppointment,
  resolveAppointmentIssue,
  syncAdminAppointments,
} from "../../data/adminMockData";

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState(getAdminAppointments);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;
    syncAdminAppointments().then((appts) => {
      if (active && appts) setAppointments(appts);
    });
    return () => {
      active = false;
    };
  }, []);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  const [selectedAppointmentForIssue, setSelectedAppointmentForIssue] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [selectedAppointmentForCancel, setSelectedAppointmentForCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const doctorsList = ["All", ...new Set(appointments.map((a) => a.doctorName))];
  const statuses = ["All", "Confirmed", "Completed", "Cancelled", "Issue Reported"];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor =
      selectedDoctorFilter === "All" || apt.doctorName === selectedDoctorFilter;
    const matchesStatus =
      selectedStatusFilter === "All" || apt.status === selectedStatusFilter;
    const matchesDate =
      !selectedDateFilter || apt.date === selectedDateFilter;
    return matchesSearch && matchesDoctor && matchesStatus && matchesDate;
  });

  const handleOpenIssue = (apt) => {
    setSelectedAppointmentForIssue(apt);
    setIsIssueModalOpen(true);
  };

  const handleOpenCancel = (apt) => {
    setSelectedAppointmentForCancel(apt);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (id, reason) => {
    const updated = cancelAdminAppointment(id, reason);
    setAppointments(updated);
  };

  const handleResolveIssue = (id, notes) => {
    const updated = resolveAppointmentIssue(id, notes);
    setAppointments(updated);
  };

  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const issueCount = appointments.filter((a) => a.status === "Issue Reported" || (a.issue && a.issue.status === "Open")).length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;

  return (
    <PanelLayout
      role="admin"
      title="Appointment Management"
      subtitle="Supervise hospital clinical bookings, filter by doctor, patient, date or status, cancel bookings, and resolve clinical escalations."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Total Appointments</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{totalCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Confirmed / Active</p>
              <p className="text-xl font-black text-sky-600 mt-0.5">{confirmedCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Clinical Escalations / Issues</p>
              <p className="text-xl font-black text-amber-600 mt-0.5">{issueCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-bold">Cancelled Bookings</p>
              <p className="text-xl font-black text-red-600 mt-0.5">{cancelledCount}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <CalendarX className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, patient, doctor, or specialty..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-bold">Doctor:</span>
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {doctorsList.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-bold">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              />
              {selectedDateFilter && (
                <button
                  onClick={() => setSelectedDateFilter("")}
                  className="text-xs text-purple-600 font-bold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              {filteredAppointments.length} Records
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Appointment #</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor & Specialty</th>
                  <th className="px-6 py-4">Schedule & Type</th>
                  <th className="px-6 py-4">Fee</th>
                  <th className="px-6 py-4">Status & Issues</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((apt) => {
                  const hasIssue = apt.status === "Issue Reported" || (apt.issue && apt.issue.status === "Open");
                  const isCancelled = apt.status === "Cancelled";

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900 text-xs">
                        {apt.appointmentNumber}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {apt.room || "Telehealth"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {apt.patientAvatar ? (
                            <img
                              src={apt.patientAvatar}
                              alt={apt.patientName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                              {apt.patientName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-extrabold text-slate-900 text-xs leading-snug">{apt.patientName}</p>
                            <p className="text-[11px] text-slate-400">ID: {apt.patientId}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs leading-snug">{apt.doctorName}</p>
                        <p className="text-[11px] text-purple-700 font-semibold">{apt.specialty}</p>
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.date} at {apt.time}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
                          {apt.type === "Video Call" ? <Video className="w-3 h-3 text-sky-500" /> : <Building className="w-3 h-3 text-emerald-500" />}
                          {apt.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-black text-emerald-600 text-xs">
                        ${apt.fee}
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              apt.status === "Confirmed"
                                ? "bg-sky-100 text-sky-800 border-sky-200"
                                : apt.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : apt.status === "Cancelled"
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {apt.status === "Confirmed" && <CheckCircle2 className="w-3 h-3" />}
                            {apt.status === "Cancelled" && <CalendarX className="w-3 h-3" />}
                            {apt.status}
                          </span>

                          {hasIssue && (
                            <button
                              onClick={() => handleOpenIssue(apt)}
                              className="block text-[11px] font-bold text-amber-700 hover:text-amber-900 underline flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              Issue: {apt.issue?.type || "Dispute Reported"}
                            </button>
                          )}

                          {isCancelled && apt.cancelReason && (
                            <p className="text-[10px] text-slate-400 italic max-w-xs truncate">
                              Reason: {apt.cancelReason}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {hasIssue && (
                            <button
                              onClick={() => handleOpenIssue(apt)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Resolve Issue</span>
                            </button>
                          )}

                          {!isCancelled && (
                            <button
                              onClick={() => handleOpenCancel(apt)}
                              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 text-xs font-bold transition flex items-center gap-1"
                            >
                              <CalendarX className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}

                          {isCancelled && (
                            <span className="text-xs text-slate-400 font-semibold px-2 py-1">
                              Archived
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-16 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-extrabold text-slate-800 text-lg">No appointments found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No appointments match your selected search keyword, doctor, date, or status filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <AppointmentIssueModal
        appointment={selectedAppointmentForIssue}
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onResolve={handleResolveIssue}
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
