import { resolveDoctorRecord } from "../../utils/doctorResolver.js";

export const getSchedule = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        availability: doctor.availability,
        customSlots: doctor.customSlots,
        blockedDates: doctor.blockedDates,
        vacations: doctor.vacations,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWorkingSchedule = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { days, startTime, endTime, breakStart, breakEnd, slotDurationMinutes } = req.body;
    if (Array.isArray(days)) doctor.availability.days = days;
    if (startTime !== undefined) doctor.availability.startTime = startTime;
    if (endTime !== undefined) doctor.availability.endTime = endTime;
    if (breakStart !== undefined) doctor.availability.breakStart = breakStart;
    if (breakEnd !== undefined) doctor.availability.breakEnd = breakEnd;
    if (slotDurationMinutes !== undefined) {
      doctor.availability.slotDurationMinutes = Number(slotDurationMinutes);
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Working days and hours updated",
      data: doctor.availability,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const buildGeneratedTimeSlots = (startTime, endTime, durationMinutes = 30) => {
  const toMinutes = (timeStr) => {
    const [h, m] = String(timeStr || "09:00").split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const toTimeStr = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const slots = [];
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const step = Math.max(Number(durationMinutes) || 30, 10);

  for (let cur = start; cur + step <= end; cur += step) {
    slots.push({
      startTime: toTimeStr(cur),
      endTime: toTimeStr(cur + step),
      isBooked: false,
      isBlocked: false,
    });
  }
  return slots;
};

export const createAppointmentSlots = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { date, slots, startTime, endTime, slotDurationMinutes } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: "date is required" });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const resolvedSlots =
      Array.isArray(slots) && slots.length > 0
        ? slots
        : buildGeneratedTimeSlots(
            startTime || doctor.availability.startTime,
            endTime || doctor.availability.endTime,
            slotDurationMinutes || doctor.availability.slotDurationMinutes
          );

    const existingIndex = doctor.customSlots.findIndex(
      (entry) => new Date(entry.date).toDateString() === targetDate.toDateString()
    );

    if (existingIndex >= 0) {
      doctor.customSlots[existingIndex].slots = resolvedSlots;
    } else {
      doctor.customSlots.push({
        date: targetDate,
        slots: resolvedSlots,
      });
    }

    await doctor.save();

    return res.status(201).json({
      success: true,
      message: "Appointment slots created successfully",
      data: doctor.customSlots,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const blockUnavailableDate = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { date, reason, unblock = false } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: "date is required" });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    if (unblock) {
      doctor.blockedDates = doctor.blockedDates.filter(
        (b) => new Date(b.date).toDateString() !== targetDate.toDateString()
      );
    } else {
      const alreadyBlocked = doctor.blockedDates.some(
        (b) => new Date(b.date).toDateString() === targetDate.toDateString()
      );
      if (!alreadyBlocked) {
        doctor.blockedDates.push({ date: targetDate, reason: reason || "Unavailable" });
      }
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: unblock ? "Date unblocked" : "Date blocked successfully",
      data: doctor.blockedDates,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const manageVacation = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { vacationId, startDate, endDate, reason, status } = req.body;

    if (vacationId) {
      const vacation = doctor.vacations.id(vacationId);
      if (!vacation) {
        return res.status(404).json({ success: false, message: "Vacation entry not found" });
      }
      if (startDate) vacation.startDate = new Date(startDate);
      if (endDate) vacation.endDate = new Date(endDate);
      if (reason !== undefined) vacation.reason = reason;
      if (status) vacation.status = status;
    } else {
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "startDate and endDate are required",
        });
      }
      doctor.vacations.push({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: reason || "Personal Leave",
        status: status || "scheduled",
      });
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Vacation / leave schedule updated",
      data: doctor.vacations,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
