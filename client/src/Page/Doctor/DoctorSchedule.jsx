import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Ban,
  Palmtree,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  X,
  Sliders,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import { getDoctorSchedule, saveDoctorSchedule } from "../../data/doctorMockData";

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState(getDoctorSchedule);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState("hours");

  const [blockDateInput, setBlockDateInput] = useState("");
  const [blockReasonInput, setBlockReasonInput] = useState("");

  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveType, setLeaveType] = useState("Annual Vacation");
  const [leaveReason, setLeaveReason] = useState("");

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day) => {
    const current = schedule.workingDays || [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    const newSchedule = { ...schedule, workingDays: updated };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
  };

  const handleHoursChange = (field, val) => {
    const newSchedule = {
      ...schedule,
      workingHours: {
        ...schedule.workingHours,
        [field]: val,
      },
    };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
  };

  const handleAddBlockDate = (e) => {
    e.preventDefault();
    if (!blockDateInput) return;
    const item = {
      id: `blk-${Date.now()}`,
      date: blockDateInput,
      reason: blockReasonInput || "Unavailable for consultations",
    };
    const newSchedule = {
      ...schedule,
      blockedDates: [item, ...(schedule.blockedDates || [])],
    };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
    setBlockDateInput("");
    setBlockReasonInput("");
  };

  const handleRemoveBlockDate = (id) => {
    const newSchedule = {
      ...schedule,
      blockedDates: (schedule.blockedDates || []).filter((b) => b.id !== id),
    };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
  };

  const handleRequestLeave = (e) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd) return;
    const item = {
      id: `lv-${Date.now()}`,
      startDate: leaveStart,
      endDate: leaveEnd,
      type: leaveType,
      reason: leaveReason || "Personal Leave",
      status: "Approved",
    };
    const newSchedule = {
      ...schedule,
      leaves: [item, ...(schedule.leaves || [])],
    };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
    setLeaveStart("");
    setLeaveEnd("");
    setLeaveReason("");
  };

  const handleCancelLeave = (id) => {
    const newSchedule = {
      ...schedule,
      leaves: (schedule.leaves || []).filter((l) => l.id !== id),
    };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
  };

  const handleToggleSlotStatus = (slotId) => {
    const updatedSlots = (schedule.slots || []).map((s) => {
      if (s.id !== slotId) return s;
      return {
        ...s,
        status: s.status === "Available" ? "Blocked" : "Available",
      };
    });
    const newSchedule = { ...schedule, slots: updatedSlots };
    saveDoctorSchedule(newSchedule);
    setSchedule(newSchedule);
  };

  const handleSaveAll = () => {
    saveDoctorSchedule(schedule);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PanelLayout
      role="doctor"
      title="Schedule & Availability Management"
      subtitle="Configure clinical consultation days, set working hours, define slot durations, block unavailable dates, and manage vacation leaves."
    >
      <div className="space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Practice schedule and availability saved successfully!</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("hours")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "hours"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Working Days & Hours</span>
          </button>

          <button
            onClick={() => setActiveTab("slots")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "slots"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Appointment Slots ({schedule.slots?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("blocked")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "blocked"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Blocked Dates ({schedule.blockedDates?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("leaves")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "leaves"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Palmtree className="w-4 h-4" />
            <span>Vacation & Leave ({schedule.leaves?.length || 0})</span>
          </button>
        </div>

        {activeTab === "hours" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Set Working Days</h3>
              <p className="text-xs text-slate-400 mb-4">Toggle the days you are available for clinical consultations</p>
              <div className="flex flex-wrap gap-2.5">
                {daysOfWeek.map((day) => {
                  const isActive = (schedule.workingDays || []).includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
                        isActive
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {day} {isActive ? "✓" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Set Working Hours & Slot Duration</h3>
              <p className="text-xs text-slate-400 mb-4">Define clinical shifts and individual patient consultation time intervals</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Shift Start Time</label>
                  <input
                    type="time"
                    value={schedule.workingHours?.start || "09:00"}
                    onChange={(e) => handleHoursChange("start", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Shift End Time</label>
                  <input
                    type="time"
                    value={schedule.workingHours?.end || "17:00"}
                    onChange={(e) => handleHoursChange("end", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Slot Duration</label>
                  <select
                    value={schedule.workingHours?.slotDurationMinutes || 30}
                    onChange={(e) => handleHoursChange("slotDurationMinutes", Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Lunch Break</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="time"
                      value={schedule.workingHours?.breakStart || "13:00"}
                      onChange={(e) => handleHoursChange("breakStart", e.target.value)}
                      className="w-1/2 px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                    />
                    <span className="text-xs text-slate-400 font-bold">-</span>
                    <input
                      type="time"
                      value={schedule.workingHours?.breakEnd || "14:00"}
                      onChange={(e) => handleHoursChange("breakEnd", e.target.value)}
                      className="w-1/2 px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAll}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Working Hours</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "slots" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Daily Appointment Slots</h3>
                <p className="text-xs text-slate-400">Click a slot to toggle between Available and Blocked status</p>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                {(schedule.slots || []).filter((s) => s.status === "Available").length} Slots Open Today
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {(schedule.slots || []).map((slot) => {
                const isBooked = slot.status === "Booked";
                const isAvailable = slot.status === "Available";

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => !isBooked && handleToggleSlotStatus(slot.id)}
                    disabled={isBooked}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 ${
                      isBooked
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                        : isAvailable
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:border-emerald-400 hover:shadow-2xs"
                        : "bg-red-50/80 border-red-200 text-red-900 hover:border-red-400"
                    }`}
                  >
                    <span className="text-xs font-black">{slot.time}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isBooked
                          ? "bg-slate-200 text-slate-600"
                          : isAvailable
                          ? "bg-emerald-200/80 text-emerald-800"
                          : "bg-red-200/80 text-red-800"
                      }`}
                    >
                      {slot.status}
                    </span>
                    {slot.patient && (
                      <span className="text-[10px] text-slate-500 truncate max-w-full font-medium">
                        {slot.patient}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "blocked" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Block Unavailable Date</h3>
              <p className="text-xs text-slate-400">Prevent bookings for full days due to emergency or scheduled outages</p>
              
              <form onSubmit={handleAddBlockDate} className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={blockDateInput}
                    onChange={(e) => setBlockDateInput(e.target.value)}
                    required
                    min={new Date().toISOString().substring(0, 10)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Reason for Blocking</label>
                  <input
                    type="text"
                    value={blockReasonInput}
                    onChange={(e) => setBlockReasonInput(e.target.value)}
                    placeholder="e.g. Hospital symposium, Clinic audit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Ban className="w-4 h-4" />
                  <span>Block Date</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Currently Blocked Dates</h3>
              
              <div className="space-y-2.5">
                {(schedule.blockedDates || []).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl border border-red-200 bg-red-50/50 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs font-black text-red-900">{b.date}</p>
                      <p className="text-xs text-red-700 font-medium">{b.reason}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockDate(b.id)}
                      className="p-2 rounded-xl bg-white hover:bg-red-100 text-red-600 border border-red-200 transition"
                      title="Unblock this date"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {(schedule.blockedDates || []).length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    No dates currently blocked. All working days are bookable!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaves" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Apply for Vacation / Leave</h3>
              <p className="text-xs text-slate-400">Request planned leave or conference absences</p>

              <form onSubmit={handleRequestLeave} className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    required
                    min={new Date().toISOString().substring(0, 10)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={leaveEnd}
                    onChange={(e) => setLeaveEnd(e.target.value)}
                    required
                    min={leaveStart || new Date().toISOString().substring(0, 10)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="Annual Vacation">Annual Vacation</option>
                    <option value="CME Conference">CME Medical Conference</option>
                    <option value="Personal Emergency">Personal Emergency</option>
                    <option value="Medical Sabbatical">Medical Sabbatical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">Reason & Destination</label>
                  <textarea
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    rows={2}
                    placeholder="Brief description for clinic coordination..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Palmtree className="w-4 h-4" />
                  <span>Submit Leave Request</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Vacation & Leave Records</h3>

              <div className="space-y-3">
                {(schedule.leaves || []).map((lv) => (
                  <div
                    key={lv.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {lv.startDate} to {lv.endDate}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {lv.type}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {lv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">{lv.reason}</p>
                    </div>

                    <button
                      onClick={() => handleCancelLeave(lv.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-slate-200 text-xs font-bold transition"
                    >
                      Cancel Leave
                    </button>
                  </div>
                ))}

                {(schedule.leaves || []).length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    No vacation or leave requests on record.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
