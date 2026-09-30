import mongoose from "mongoose";
import Doctor from "../model/doctor.model.js";
import Patient from "../model/patient.model.js";
import Appointment from "../model/appointment.model.js";
import Consultation from "../model/consultation.model.js";
import Prescription from "../model/prescription.model.js";
import MedicalReport from "../model/report.model.js";
import { Transaction, DoctorPayout } from "../model/payment.model.js";
import { UploadImage } from "../utils/upload-image.js";
import { buildPrescriptionPdfBuffer } from "../utils/generate-prescription-pdf.js";

const resolveDoctorRecord = async (req, autoCreate = false) => {
  const explicitDoctorId = req.query?.doctorId || req.body?.doctorId || req.params?.doctorId;
  if (explicitDoctorId && mongoose.Types.ObjectId.isValid(explicitDoctorId)) {
    const byId = await Doctor.findById(explicitDoctorId);
    if (byId) return byId;
  }

  const userId = req.user?._id || req.user?.id;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const byUserId = await Doctor.findOne({ userId });
    if (byUserId) return byUserId;
  }

  if (req.user?.email) {
    const byEmail = await Doctor.findOne({ email: req.user.email.toLowerCase().trim() });
    if (byEmail) return byEmail;
  }

  if (autoCreate && req.user?.email) {
    return await Doctor.create({
      userId: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
      name: req.user.username || "Dr. Specialist",
      email: req.user.email.toLowerCase().trim(),
      specialty: req.body?.specialty || "General Medicine",
      department: req.body?.department || "General Medicine",
      fee: Number(req.body?.fee || 500),
      imageUrl: req.user.imageUrl,
    });
  }

  return null;
};

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        profile: doctor,
        verificationStatus: {
          registrationStatus: doctor.registrationStatus,
          isQualifiedVerified: doctor.isQualifiedVerified,
          accountStatus: doctor.accountStatus,
          rejectionReason: doctor.rejectionReason,
          suspensionReason: doctor.suspensionReason,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const editableFields = [
      "name",
      "phone",
      "specialty",
      "department",
      "experience",
      "fee",
      "bio",
      "languages",
      "clinicInfo",
      "qualifications",
      "imageUrl",
    ];

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        doctor[field] = req.body[field];
      }
    }

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-doctor-profiles", baseUrl);
      if (uploaded?.secure_url) {
        doctor.imageUrl = uploaded.secure_url;
      }
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getVerificationStatus = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        doctorId: doctor._id,
        registrationStatus: doctor.registrationStatus,
        isQualifiedVerified: doctor.isQualifiedVerified,
        accountStatus: doctor.accountStatus,
        rejectionReason: doctor.rejectionReason,
        suspensionReason: doctor.suspensionReason,
        qualifications: doctor.qualifications,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

    const now = new Date();
    const appointments = await Appointment.find({
      doctorId: doctor._id,
      appointmentDate: { $gte: now },
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

export const getDoctorPatients = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const patientIds = await Appointment.distinct("patientId", { doctorId: doctor._id });
    const { search } = req.query;

    const query =
      patientIds.length > 0
        ? { _id: { $in: patientIds } }
        : {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(query).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientMedicalRecord = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const [previousConsultations, previousPrescriptions, uploadedReports, appointments] =
      await Promise.all([
        Consultation.find({ patientId: patient._id }).sort({ createdAt: -1 }),
        Prescription.find({ patientId: patient._id }).sort({ issuedAt: -1 }),
        MedicalReport.find({ patientId: patient._id }).sort({ reportDate: -1 }),
        Appointment.find({ patientId: patient._id }).sort({ appointmentDate: -1 }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        patient,
        medicalHistory: patient.medicalHistory,
        medicalConditions: patient.medicalConditions,
        allergies: patient.allergies,
        currentMedications: patient.currentMedications,
        previousConsultations,
        previousPrescriptions,
        uploadedReports,
        appointments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatientClinicalInfo = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const { allergies, currentMedications, medicalHistory, medicalConditions } = req.body;
    if (Array.isArray(allergies)) patient.allergies = allergies;
    if (Array.isArray(currentMedications)) patient.currentMedications = currentMedications;
    if (Array.isArray(medicalHistory)) patient.medicalHistory = medicalHistory;
    if (Array.isArray(medicalConditions)) patient.medicalConditions = medicalConditions;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient clinical profile updated",
      data: patient,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const startVideoConsultation = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { appointmentId, patientId, patientName } = req.body;
    let appointment = null;
    if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
      appointment = await Appointment.findById(appointmentId);
    }

    const resolvedPatientId = appointment?.patientId || patientId;
    if (!resolvedPatientId) {
      return res.status(400).json({
        success: false,
        message: "patientId or valid appointmentId is required",
      });
    }

    const patient = await Patient.findById(resolvedPatientId);
    const roomId = `medicare-room-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const meetingUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/consultation/${roomId}`;

    let consultation = appointmentId
      ? await Consultation.findOne({ appointmentId })
      : null;

    if (consultation) {
      consultation.videoSession.status = "active";
      consultation.videoSession.startedAt = new Date();
      if (!consultation.videoSession.roomId) {
        consultation.videoSession.roomId = roomId;
        consultation.videoSession.meetingUrl = meetingUrl;
      }
      consultation.status = "in_progress";
      await consultation.save();
    } else {
      consultation = await Consultation.create({
        appointmentId: appointment?._id,
        doctorId: doctor._id,
        doctorName: doctor.name,
        patientId: resolvedPatientId,
        patientName: patient?.name || appointment?.patientName || patientName || "Patient",
        videoSession: {
          roomId,
          meetingUrl,
          status: "active",
          startedAt: new Date(),
        },
        status: "in_progress",
      });
    }

    if (appointment) {
      appointment.status = "in_progress";
      await appointment.save();
    }

    return res.status(201).json({
      success: true,
      message: "Video consultation started",
      data: consultation,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const endVideoConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    consultation.videoSession.status = "ended";
    consultation.videoSession.endedAt = new Date();
    consultation.status = "completed";
    await consultation.save();

    if (consultation.appointmentId) {
      await Appointment.findByIdAndUpdate(consultation.appointmentId, {
        status: "completed",
      });
    }

    await Doctor.findByIdAndUpdate(consultation.doctorId, {
      $inc: { totalConsultations: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Video consultation completed",
      data: consultation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendConsultationChatMessage = async (req, res) => {
  try {
    const { message, attachmentUrl, senderRole } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "message is required" });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    const newMessage = {
      senderId: String(req.user?._id || req.user?.id || consultation.doctorId),
      senderRole: senderRole === "patient" ? "patient" : "doctor",
      senderName: req.user?.username || consultation.doctorName,
      message: message.trim(),
      attachmentUrl: attachmentUrl || "",
      sentAt: new Date(),
    };

    consultation.chatMessages.push(newMessage);
    await consultation.save();

    return res.status(201).json({
      success: true,
      message: "Chat message sent",
      data: consultation.chatMessages[consultation.chatMessages.length - 1],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getConsultationChatMessages = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    return res.status(200).json({
      success: true,
      data: consultation.chatMessages,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConsultationDetails = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    const {
      consultationNotes,
      diagnosis,
      symptoms,
      treatmentPlan,
      vitals,
      followUpDate,
      status,
    } = req.body;

    if (consultationNotes !== undefined) consultation.consultationNotes = consultationNotes;
    if (diagnosis !== undefined) consultation.diagnosis = diagnosis;
    if (Array.isArray(symptoms)) consultation.symptoms = symptoms;
    if (treatmentPlan !== undefined) consultation.treatmentPlan = treatmentPlan;
    if (vitals !== undefined) consultation.vitals = { ...consultation.vitals, ...vitals };
    if (followUpDate !== undefined) {
      consultation.followUpDate = followUpDate ? new Date(followUpDate) : undefined;
    }
    if (status) consultation.status = status;

    await consultation.save();

    if (status === "completed" && consultation.appointmentId) {
      await Appointment.findByIdAndUpdate(consultation.appointmentId, {
        status: "completed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation clinical notes saved",
      data: consultation,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    return res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const {
      consultationId,
      appointmentId,
      patientId,
      patientName,
      diagnosis,
      symptoms,
      medicines,
      generalInstructions,
      followUpDate,
    } = req.body;

    if (!patientId || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patientId and at least one medicine are required",
      });
    }

    const patient = await Patient.findById(patientId);
    const qualificationsStr = (doctor.qualifications || [])
      .map((q) => q.degree)
      .filter(Boolean)
      .join(", ");

    const prescription = await Prescription.create({
      prescriptionNumber: `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      consultationId,
      appointmentId,
      doctorId: doctor._id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorQualifications: qualificationsStr,
      clinicName: doctor.clinicInfo?.clinicName || doctor.clinicInfo?.hospitalAffiliation || "Medicare Clinic",
      patientId,
      patientName: patient?.name || patientName || "Patient",
      patientAge: patient?.age || 0,
      patientGender: patient?.gender || "",
      diagnosis: diagnosis || "",
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      medicines,
      generalInstructions: generalInstructions || "",
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      issuedAt: new Date(),
    });

    if (patient) {
      medicines.forEach((m) => {
        patient.currentMedications.push({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          startedAt: new Date(),
          prescribedBy: doctor.name,
        });
      });
      await patient.save();
    }

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrescriptionHistory = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { patientId, appointmentId, search } = req.query;
    const query = { doctorId: doctor._id };
    if (patientId) query.patientId = patientId;
    if (appointmentId) query.appointmentId = appointmentId;
    if (search) {
      query.$or = [
        { prescriptionNumber: { $regex: search, $options: "i" } },
        { patientName: { $regex: search, $options: "i" } },
        { diagnosis: { $regex: search, $options: "i" } },
      ];
    }

    const prescriptions = await Prescription.find(query).sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    return res.status(200).json({
      success: true,
      data: prescription,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generatePrescriptionPdf = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    const pdfBuffer = buildPrescriptionPdfBuffer(prescription);

    if (req.query.format === "json") {
      return res.status(200).json({
        success: true,
        data: {
          prescriptionNumber: prescription.prescriptionNumber,
          fileName: `${prescription.prescriptionNumber}.pdf`,
          mimeType: "application/pdf",
          base64: pdfBuffer.toString("base64"),
        },
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${prescription.prescriptionNumber}.pdf"`
    );
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadMedicalReport = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const {
      patientId,
      patientName,
      appointmentId,
      consultationId,
      title,
      reportType,
      interpretation,
      notes,
      criticalFlag,
      reportDate,
    } = req.body;

    if (!patientId || !title) {
      return res.status(400).json({
        success: false,
        message: "patientId and title are required",
      });
    }

    let fileUrl = req.body.fileUrl || "";
    let filePublicId = "";

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-medical-reports", baseUrl);
      if (uploaded?.secure_url) {
        fileUrl = uploaded.secure_url;
        filePublicId = uploaded.public_id || "";
      }
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "A report file upload or fileUrl is required",
      });
    }

    const patient = await Patient.findById(patientId);

    const report = await MedicalReport.create({
      patientId,
      patientName: patient?.name || patientName || "Patient",
      doctorId: doctor._id,
      doctorName: doctor.name,
      appointmentId,
      consultationId,
      title,
      reportType: reportType || "lab",
      fileUrl,
      filePublicId,
      uploadedByRole: "doctor",
      interpretation: interpretation || "",
      notes: notes || "",
      criticalFlag: Boolean(criticalFlag),
      interpretedAt: interpretation ? new Date() : undefined,
      reportDate: reportDate ? new Date(reportDate) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Medical report uploaded successfully",
      data: report,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientReports = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { patientId, reportType } = req.query;
    const query = {};
    if (patientId) {
      query.patientId = patientId;
    } else {
      query.doctorId = doctor._id;
    }
    if (reportType) query.reportType = reportType;

    const reports = await MedicalReport.find(query).sort({ reportDate: -1 });

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addReportInterpretation = async (req, res) => {
  try {
    const { interpretation, notes, criticalFlag } = req.body;
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Medical report not found" });
    }

    if (interpretation !== undefined) report.interpretation = interpretation;
    if (notes !== undefined) report.notes = notes;
    if (criticalFlag !== undefined) report.criticalFlag = Boolean(criticalFlag);
    report.interpretedAt = new Date();

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report interpretation and notes saved",
      data: report,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      todayAppointmentsList,
      uniquePatients,
      completedConsultationsCount,
      pendingAppointmentsCount,
      revenueAggregation,
      payoutsSummary,
      monthlyAppointmentStats,
    ] = await Promise.all([
      Appointment.find({
        doctorId: doctor._id,
        appointmentDate: { $gte: startOfToday, $lte: endOfToday },
      }).sort({ timeSlot: 1 }),
      Appointment.distinct("patientId", { doctorId: doctor._id }),
      Appointment.countDocuments({ doctorId: doctor._id, status: "completed" }),
      Appointment.countDocuments({
        doctorId: doctor._id,
        status: { $in: ["pending", "scheduled", "confirmed", "accepted", "rescheduled"] },
      }),
      Transaction.aggregate([
        { $match: { doctorId: doctor._id, status: "completed" } },
        {
          $group: {
            _id: null,
            grossFeeCollected: { $sum: "$amount" },
            netDoctorRevenue: { $sum: "$doctorEarning" },
            transactionsCount: { $sum: 1 },
          },
        },
      ]),
      DoctorPayout.aggregate([
        { $match: { doctorId: doctor._id } },
        {
          $group: {
            _id: "$status",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Appointment.aggregate([
        { $match: { doctorId: doctor._id } },
        {
          $group: {
            _id: {
              year: { $year: "$appointmentDate" },
              month: { $month: "$appointmentDate" },
            },
            totalAppointments: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $in: ["$status", ["cancelled", "rejected"]] }, 1, 0] },
            },
            pending: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      "$status",
                      ["pending", "scheduled", "confirmed", "accepted", "rescheduled"],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            estimatedRevenue: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$fee", 0] },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
    ]);

    const rev = revenueAggregation[0] || {
      grossFeeCollected: 0,
      netDoctorRevenue: 0,
      transactionsCount: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          department: doctor.department,
          registrationStatus: doctor.registrationStatus,
          isQualifiedVerified: doctor.isQualifiedVerified,
        },
        todayAppointments: {
          count: todayAppointmentsList.length,
          appointments: todayAppointmentsList,
        },
        totalPatients: uniquePatients.length,
        completedConsultations: completedConsultationsCount,
        pendingAppointments: pendingAppointmentsCount,
        revenue: {
          grossFeeCollected: rev.grossFeeCollected,
          netDoctorRevenue: rev.netDoctorRevenue,
          transactionsCount: rev.transactionsCount,
          payoutsSummary,
        },
        monthlyAppointmentStatistics: monthlyAppointmentStats,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
