import Appointment from "../../model/appointment.model.js";
import { recordAudit } from "../../utils/auditLogger.js";

export const getAllAppointments = async (req, res) => {
  try {
    const {
      doctorId,
      patientId,
      status,
      paymentStatus,
      date,
      startDate,
      endDate,
      hasIssue,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (hasIssue !== undefined) {
      query["issue.hasIssue"] = hasIssue === "true";
    }
    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: dayStart, $lte: dayEnd };
    } else if (startDate || endDate) {
      query.appointmentDate = {};
      if (startDate) query.appointmentDate.$gte = new Date(startDate);
      if (endDate) query.appointmentDate.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { doctorName: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
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

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    await recordAudit(req, {
      action: "CREATE_APPOINTMENT",
      module: "appointment",
      targetType: "Appointment",
      targetId: appointment._id,
      details: {
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        appointmentDate: appointment.appointmentDate,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = cancellationReason || "Cancelled by administrator";
    appointment.cancelledBy = req.user?.username || "admin";
    appointment.cancelledAt = new Date();
    await appointment.save();

    await recordAudit(req, {
      action: "CANCEL_APPOINTMENT",
      module: "appointment",
      targetType: "Appointment",
      targetId: appointment._id,
      details: { cancellationReason: appointment.cancellationReason },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveAppointmentIssue = async (req, res) => {
  try {
    const { issueStatus = "resolved", resolutionNotes, appointmentStatus, description } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.issue.hasIssue = issueStatus !== "resolved";
    appointment.issue.status = issueStatus;
    if (description !== undefined) {
      appointment.issue.description = description;
    }
    appointment.issue.resolutionNotes = resolutionNotes || "";
    if (issueStatus === "resolved") {
      appointment.issue.resolvedAt = new Date();
    }
    if (appointmentStatus) {
      appointment.status = appointmentStatus;
    }

    await appointment.save();

    await recordAudit(req, {
      action: "RESOLVE_APPOINTMENT_ISSUE",
      module: "appointment",
      targetType: "Appointment",
      targetId: appointment._id,
      details: { issueStatus, resolutionNotes, appointmentStatus },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment issue updated successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
