import mongoose from "mongoose";
import Doctor from "../../model/doctor.model.js";
import Appointment from "../../model/appointment.model.js";
import { Notification } from "../../model/system.model.js";
import { resolvePatientRecord } from "../../utils/patientResolver.js";

export const searchDoctors = async (req, res) => {
  try {
    const {
      specialty,
      department,
      search,
      minFee,
      maxFee,
      minExperience,
      language,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      accountStatus: "active",
      registrationStatus: "approved",
    };

    if (specialty) query.specialty = { $regex: specialty, $options: "i" };
    if (department) query.department = { $regex: department, $options: "i" };
    if (language) query.languages = { $in: [new RegExp(language, "i")] };
    if (minExperience !== undefined) {
      query.experience = { $gte: Number(minExperience) };
    }
    if (minFee !== undefined || maxFee !== undefined) {
      query.fee = {};
      if (minFee !== undefined) query.fee.$gte = Number(minFee);
      if (maxFee !== undefined) query.fee.$lte = Number(maxFee);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { "clinicInfo.clinicName": { $regex: search, $options: "i" } },
        { "clinicInfo.city": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [doctors, total] = await Promise.all([
      Doctor.find(query)
        .sort({ rating: -1, experience: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Doctor.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorPublicProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const generateDefaultSlots = (startTime = "09:00", endTime = "17:00", duration = 30) => {
  const toMinutes = (str) => {
    const [h, m] = String(str).split(":").map(Number);
    return h * 60 + (m || 0);
  };
  const toTimeStr = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const result = [];
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const step = Math.max(Number(duration) || 30, 10);

  for (let cur = start; cur + step <= end; cur += step) {
    result.push({
      startTime: toTimeStr(cur),
      endTime: toTimeStr(cur + step),
      timeSlot: `${toTimeStr(cur)} - ${toTimeStr(cur + step)}`,
    });
  }
  return result;
};

export const getDoctorAvailableSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    const dayStart = new Date(dateParam);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateParam);
    dayEnd.setHours(23, 59, 59, 999);

    const isBlockedDate = (doctor.blockedDates || []).some(
      (b) => new Date(b.date).toDateString() === dayStart.toDateString()
    );

    const isOnVacation = (doctor.vacations || []).some(
      (v) =>
        v.status !== "cancelled" &&
        dayStart >= new Date(new Date(v.startDate).setHours(0, 0, 0, 0)) &&
        dayStart <= new Date(new Date(v.endDate).setHours(23, 59, 59, 999))
    );

    if (isBlockedDate || isOnVacation) {
      return res.status(200).json({
        success: true,
        data: {
          doctorId: doctor._id,
          date: dayStart,
          isAvailable: false,
          reason: isBlockedDate ? "Doctor unavailable on this date" : "Doctor is on leave",
          availableSlots: [],
        },
      });
    }

    const existingAppointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ["cancelled", "rejected"] },
    });

    const bookedSlotStrings = new Set(existingAppointments.map((a) => a.timeSlot));

    const customEntry = (doctor.customSlots || []).find(
      (c) => new Date(c.date).toDateString() === dayStart.toDateString()
    );

    let candidateSlots = [];
    if (customEntry && Array.isArray(customEntry.slots)) {
      candidateSlots = customEntry.slots
        .filter((s) => !s.isBlocked && !s.isBooked)
        .map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime,
          timeSlot: `${s.startTime} - ${s.endTime}`,
        }));
    } else {
      candidateSlots = generateDefaultSlots(
        doctor.availability?.startTime || "09:00",
        doctor.availability?.endTime || "17:00",
        doctor.availability?.slotDurationMinutes || 30
      );
    }

    const availableSlots = candidateSlots.filter(
      (s) => !bookedSlotStrings.has(s.timeSlot) && !bookedSlotStrings.has(s.startTime)
    );

    return res.status(200).json({
      success: true,
      data: {
        doctorId: doctor._id,
        doctorName: doctor.name,
        date: dayStart,
        isAvailable: availableSlots.length > 0,
        availableSlots,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const {
      doctorId,
      appointmentDate,
      timeSlot,
      consultationType = "video",
      reasonForVisit,
      notes,
    } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "doctorId, appointmentDate, and timeSlot are required",
      });
    }

    let doctor = null;
    if (mongoose.isValidObjectId(doctorId)) {
      doctor = await Doctor.findById(doctorId);
    }
    if (!doctor) {
      doctor = await Doctor.findOne({ accountStatus: "active" });
    }
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const apptDateObj = new Date(appointmentDate);
    const reminderTime = new Date(apptDateObj.getTime() - 60 * 60 * 1000);

    const appointment = await Appointment.create({
      patientId: patient._id,
      patientName: patient.name,
      patientEmail: patient.email,
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      department: doctor.department,
      appointmentDate: apptDateObj,
      timeSlot,
      consultationType,
      status: "scheduled",
      fee: doctor.fee,
      paymentStatus: "pending",
      reasonForVisit: reasonForVisit || "",
      notes: notes || "",
      reminders: [
        {
          reminderTime,
          message: `Reminder: Appointment with ${doctor.name} at ${timeSlot}`,
          channel: "in_app",
          isSent: false,
        },
      ],
    });

    await Notification.create({
      title: "Appointment Booked & Reminder Scheduled",
      message: `Your appointment with ${doctor.name} (${doctor.specialty}) is scheduled for ${apptDateObj.toISOString().split("T")[0]} at ${timeSlot}.`,
      type: "appointment_reminder",
      recipientRole: "patient",
      patientId: patient._id,
      doctorId: doctor._id,
      metadata: { appointmentId: appointment._id },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const reschedulePatientAppointment = async (req, res) => {
  try {
    const { newDate, newTimeSlot, reason } = req.body;
    if (!newDate || !newTimeSlot) {
      return res.status(400).json({
        success: false,
        message: "newDate and newTimeSlot are required",
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.rescheduleHistory.push({
      previousDate: appointment.appointmentDate,
      previousTimeSlot: appointment.timeSlot,
      newDate: new Date(newDate),
      newTimeSlot,
      reason: reason || "Rescheduled by patient",
      rescheduledBy: "patient",
      rescheduledAt: new Date(),
    });

    appointment.appointmentDate = new Date(newDate);
    appointment.timeSlot = newTimeSlot;
    appointment.status = "rescheduled";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelPatientAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = cancellationReason || "Cancelled by patient";
    appointment.cancelledBy = "patient";
    appointment.cancelledAt = new Date();
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientAppointmentHistory = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { status } = req.query;
    const query = { patientId: patient._id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query).sort({ appointmentDate: -1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientUpcomingAppointments = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const appointments = await Appointment.find({
      patientId: patient._id,
      appointmentDate: { $gte: startOfToday },
      status: { $in: ["pending", "scheduled", "confirmed", "accepted", "rescheduled"] },
    }).sort({ appointmentDate: 1, timeSlot: 1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentReminders = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const appointments = await Appointment.find({
      patientId: patient._id,
      status: { $in: ["scheduled", "confirmed", "accepted", "rescheduled"] },
    }).select("doctorName specialty appointmentDate timeSlot consultationType reminders");

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAppointmentReminder = async (req, res) => {
  try {
    const { reminderTime, message, channel = "in_app" } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.reminders.push({
      reminderTime: reminderTime ? new Date(reminderTime) : new Date(),
      message:
        message ||
        `Reminder: Appointment with ${appointment.doctorName} on ${new Date(
          appointment.appointmentDate
        )
          .toISOString()
          .split("T")[0]} at ${appointment.timeSlot}`,
      channel,
      isSent: false,
    });

    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment reminder added",
      data: appointment.reminders,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
