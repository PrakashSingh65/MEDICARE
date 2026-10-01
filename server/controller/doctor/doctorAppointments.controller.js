import Appointment from "../../model/appointment.model.js";
import Patient from "../../model/patient.model.js";
import Consultation from "../../model/consultation.model.js";
import Prescription from "../../model/prescription.model.js";
import MedicalReport from "../../model/report.model.js";
import { resolveDoctorRecord } from "../../utils/doctorResolver.js";

export const getTodayAppointments = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ timeSlot: 1 });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUpcomingAppointments = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: startOfDay },
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

export const respondToAppointment = async (req, res) => {
  try {
    const { action, status, rejectionReason } = req.body;
    const normalizedAction = (action || status || "").toLowerCase();

    if (!["accept", "accepted", "reject", "rejected"].includes(normalizedAction)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Use accept or reject",
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (normalizedAction.startsWith("accept")) {
      appointment.status = "accepted";
      appointment.rejectionReason = "";
    } else {
      appointment.status = "rejected";
      appointment.rejectionReason = rejectionReason || "Doctor unavailable for requested slot";
    }

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: `Appointment ${appointment.status}`,
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
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
      reason: reason || "Rescheduled by doctor",
      rescheduledBy: req.user?.username || "doctor",
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

export const getAppointmentHistory = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { status, patientId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = { doctorId: doctor._id };

    if (status) query.status = status;
    if (patientId) query.patientId = patientId;
    if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Appointment.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: appointments,
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

export const getAppointmentPatientDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const [patient, consultations, prescriptions, reports] = await Promise.all([
      Patient.findById(appointment.patientId),
      Consultation.find({ patientId: appointment.patientId }).sort({ createdAt: -1 }),
      Prescription.find({ patientId: appointment.patientId }).sort({ issuedAt: -1 }),
      MedicalReport.find({ patientId: appointment.patientId }).sort({ reportDate: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        appointment,
        patient,
        previousConsultations: consultations,
        previousPrescriptions: prescriptions,
        uploadedReports: reports,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
