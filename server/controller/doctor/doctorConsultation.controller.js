import mongoose from "mongoose";
import Consultation from "../../model/consultation.model.js";
import Appointment from "../../model/appointment.model.js";
import Patient from "../../model/patient.model.js";
import Doctor from "../../model/doctor.model.js";
import { resolveDoctorRecord } from "../../utils/doctorResolver.js";

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
