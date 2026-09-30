import Doctor from "../model/doctor.model.js";
import Patient from "../model/patient.model.js";
import Appointment from "../model/appointment.model.js";
import { Transaction, DoctorPayout } from "../model/payment.model.js";
import {
  Specialty,
  Department,
  Faq,
  HealthArticle,
  Announcement,
} from "../model/content.model.js";
import {
  RolePermission,
  AuditLog,
  Notification,
  SystemSetting,
} from "../model/system.model.js";
import User from "../model/user.model.js";

const recordAudit = async (req, payload) => {
  try {
    const actorId = String(req.user?._id || req.user?.id || "system");
    const actorName = req.user?.username || req.user?.email || "Administrator";
    const actorRole = req.user?.role || "admin";
    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action: payload.action,
      module: payload.module,
      targetType: payload.targetType || "",
      targetId: payload.targetId ? String(payload.targetId) : "",
      details: payload.details || {},
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });
  } catch (_err) {}
};

export const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      activePatients,
      totalDoctors,
      activeDoctors,
      pendingDoctorRegistration,
      unverifiedQualifications,
      suspendedDoctors,
      totalAppointments,
      scheduledAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      disputedAppointments,
      todayAppointments,
      revenueAggregation,
      monthlyRevenue,
      specialtyDistribution,
      recentAuditLogs,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ accountStatus: "active" }),
      Doctor.countDocuments(),
      Doctor.countDocuments({ accountStatus: "active", registrationStatus: "approved" }),
      Doctor.countDocuments({ registrationStatus: "pending" }),
      Doctor.countDocuments({ isQualifiedVerified: false }),
      Doctor.countDocuments({ accountStatus: "suspended" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "scheduled" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Appointment.countDocuments({ $or: [{ status: "disputed" }, { "issue.hasIssue": true }] }),
      Appointment.countDocuments({
        appointmentDate: { $gte: startOfToday, $lte: endOfToday },
      }),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            grossRevenue: {
              $sum: {
                $cond: [{ $in: ["$status", ["completed", "refunded"]] }, "$amount", 0],
              },
            },
            completedRevenue: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
            },
            platformCommission: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$platformFee", 0] },
            },
            doctorEarnings: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$doctorEarning", 0] },
            },
            refundedTotal: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$refund.refundAmount", 0] },
            },
            failedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" },
            },
            revenue: { $sum: "$amount" },
            platformFee: { $sum: "$platformFee" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
      Doctor.aggregate([
        { $group: { _id: "$specialty", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AuditLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const rev = revenueAggregation[0] || {
      grossRevenue: 0,
      completedRevenue: 0,
      platformCommission: 0,
      doctorEarnings: 0,
      refundedTotal: 0,
      failedTransactions: 0,
    };

    const completionRate =
      totalAppointments > 0
        ? Number(((completedAppointments / totalAppointments) * 100).toFixed(2))
        : 0;

    const doctorApprovalRate =
      totalDoctors > 0
        ? Number(((activeDoctors / totalDoctors) * 100).toFixed(2))
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        activeDoctors,
        pendingDoctorVerification: {
          pendingRegistrations: pendingDoctorRegistration,
          unverifiedQualifications,
          suspendedDoctors,
        },
        appointments: {
          total: totalAppointments,
          scheduled: scheduledAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          disputed: disputedAppointments,
          today: todayAppointments,
        },
        revenue: {
          grossRevenue: rev.grossRevenue,
          netRevenue: rev.completedRevenue,
          platformCommission: rev.platformCommission,
          doctorEarnings: rev.doctorEarnings,
          totalRefunded: rev.refundedTotal,
          failedTransactions: rev.failedTransactions,
          monthlyTrend: monthlyRevenue,
        },
        platformStatistics: {
          activePatients,
          appointmentCompletionRate: completionRate,
          doctorApprovalRate,
          specialtyDistribution,
          recentAuditLogs,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const {
      search,
      specialty,
      department,
      registrationStatus,
      accountStatus,
      isQualifiedVerified,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { specialty: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }
    if (specialty) query.specialty = specialty;
    if (department) query.department = department;
    if (registrationStatus) query.registrationStatus = registrationStatus;
    if (accountStatus) query.accountStatus = accountStatus;
    if (isQualifiedVerified !== undefined) {
      query.isQualifiedVerified = isQualifiedVerified === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [doctors, total] = await Promise.all([
      Doctor.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
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

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    const [appointments, payouts] = await Promise.all([
      Appointment.find({ doctorId: doctor._id }).sort({ appointmentDate: -1 }).limit(20),
      DoctorPayout.find({ doctorId: doctor._id }).sort({ createdAt: -1 }).limit(10),
    ]);
    return res.status(200).json({
      success: true,
      data: { doctor, appointments, payouts },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    await recordAudit(req, {
      action: "CREATE_DOCTOR",
      module: "doctor",
      targetType: "Doctor",
      targetId: doctor._id,
      details: { name: doctor.name, email: doctor.email, specialty: doctor.specialty },
    });
    return res.status(201).json({
      success: true,
      message: "Doctor profile created successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const reviewDoctorRegistration = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration status. Allowed: approved, rejected, pending",
      });
    }

    const updateFields = {
      registrationStatus: status,
      rejectionReason: status === "rejected" ? rejectionReason || "Requirements not met" : "",
    };
    if (status === "approved") {
      updateFields.accountStatus = "active";
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await recordAudit(req, {
      action: `DOCTOR_REGISTRATION_${status.toUpperCase()}`,
      module: "doctor",
      targetType: "Doctor",
      targetId: doctor._id,
      details: { status, rejectionReason: updateFields.rejectionReason },
    });

    return res.status(200).json({
      success: true,
      message: `Doctor registration ${status}`,
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyDoctorQualifications = async (req, res) => {
  try {
    const { qualificationId, verified = true } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const verifierId =
      req.user?._id && !String(req.user._id).startsWith("admin-") && !String(req.user._id).startsWith("user-")
        ? req.user._id
        : undefined;

    if (qualificationId) {
      const qual = doctor.qualifications.id(qualificationId);
      if (!qual) {
        return res.status(404).json({ success: false, message: "Qualification entry not found" });
      }
      qual.verified = Boolean(verified);
      qual.verifiedAt = verified ? new Date() : undefined;
      if (verifierId) qual.verifiedBy = verifierId;
    } else {
      doctor.qualifications.forEach((q) => {
        q.verified = Boolean(verified);
        q.verifiedAt = verified ? new Date() : undefined;
        if (verifierId) q.verifiedBy = verifierId;
      });
    }

    doctor.isQualifiedVerified =
      doctor.qualifications.length > 0
        ? doctor.qualifications.every((q) => q.verified)
        : Boolean(verified);

    await doctor.save();

    await recordAudit(req, {
      action: "VERIFY_DOCTOR_QUALIFICATIONS",
      module: "doctor",
      targetType: "Doctor",
      targetId: doctor._id,
      details: { qualificationId: qualificationId || "ALL", verified },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor qualifications verification updated",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctorStatus = async (req, res) => {
  try {
    const { accountStatus, suspensionReason } = req.body;
    if (!["active", "suspended", "inactive"].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account status. Allowed: active, suspended, inactive",
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        accountStatus,
        suspensionReason: accountStatus === "suspended" ? suspensionReason || "" : "",
      },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (doctor.userId) {
      await User.findByIdAndUpdate(doctor.userId, { isActive: accountStatus === "active" });
    }

    await recordAudit(req, {
      action: `DOCTOR_STATUS_${accountStatus.toUpperCase()}`,
      module: "doctor",
      targetType: "Doctor",
      targetId: doctor._id,
      details: { accountStatus, suspensionReason },
    });

    return res.status(200).json({
      success: true,
      message: `Doctor account status updated to ${accountStatus}`,
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctorInfo = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "specialty",
      "department",
      "experience",
      "fee",
      "imageUrl",
      "bio",
      "availability",
      "qualifications",
      "rating",
    ];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await recordAudit(req, {
      action: "UPDATE_DOCTOR_INFO",
      module: "doctor",
      targetType: "Doctor",
      targetId: doctor._id,
      details: { updatedFields: Object.keys(updates) },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor information updated successfully",
      data: doctor,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    await recordAudit(req, {
      action: "DELETE_DOCTOR",
      module: "doctor",
      targetType: "Doctor",
      targetId: doctor._id,
      details: { name: doctor.name, email: doctor.email },
    });
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const {
      search,
      accountStatus,
      bloodGroup,
      gender,
      plan,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (accountStatus) query.accountStatus = accountStatus;
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (gender) query.gender = gender;
    if (plan) query.plan = plan;

    const skip = (Number(page) - 1) * Number(limit);
    const [patients, total] = await Promise.all([
      Patient.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Patient.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: patients,
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

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    return res.status(200).json({ success: true, data: patient });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create({
      ...req.body,
      activityLog: [
        {
          action: "Account created by administrator",
          ipAddress: req.ip || "",
          device: req.headers["user-agent"] || "",
          timestamp: new Date(),
        },
      ],
    });
    await recordAudit(req, {
      action: "CREATE_PATIENT",
      module: "patient",
      targetType: "Patient",
      targetId: patient._id,
      details: { name: patient.name, email: patient.email },
    });
    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_PATIENT",
      module: "patient",
      targetType: "Patient",
      targetId: patient._id,
      details: { updatedFields: Object.keys(req.body) },
    });
    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePatientStatus = async (req, res) => {
  try {
    const { accountStatus, statusReason } = req.body;
    if (!["active", "deactivated"].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid accountStatus. Allowed: active, deactivated",
      });
    }

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    patient.accountStatus = accountStatus;
    patient.statusReason = statusReason || "";
    patient.activityLog.push({
      action: `Account ${accountStatus} by administrator`,
      ipAddress: req.ip || "",
      device: req.headers["user-agent"] || "",
      metadata: { reason: statusReason || "" },
      timestamp: new Date(),
    });
    await patient.save();

    if (patient.userId) {
      await User.findByIdAndUpdate(patient.userId, {
        isActive: accountStatus === "active",
      });
    }

    await recordAudit(req, {
      action: `PATIENT_ACCOUNT_${accountStatus.toUpperCase()}`,
      module: "patient",
      targetType: "Patient",
      targetId: patient._id,
      details: { accountStatus, statusReason },
    });

    return res.status(200).json({
      success: true,
      message: `Patient account ${accountStatus}`,
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientActivity = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const [appointments, transactions] = await Promise.all([
      Appointment.find({ patientId: patient._id }).sort({ appointmentDate: -1 }),
      Transaction.find({ patientId: patient._id }).sort({ paidAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        patientId: patient._id,
        name: patient.name,
        email: patient.email,
        accountStatus: patient.accountStatus,
        lastLoginAt: patient.lastLoginAt,
        activityLog: patient.activityLog.sort((a, b) => b.timestamp - a.timestamp),
        appointments,
        transactions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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

export const getTransactions = async (req, res) => {
  try {
    const {
      status,
      paymentMethod,
      doctorId,
      patientId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (startDate || endDate) {
      query.paidAt = {};
      if (startDate) query.paidAt.$gte = new Date(startDate);
      if (endDate) query.paidAt.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { transactionReference: { $regex: search, $options: "i" } },
        { patientName: { $regex: search, $options: "i" } },
        { doctorName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ paidAt: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
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

export const createTransaction = async (req, res) => {
  try {
    const amount = Number(req.body.amount || 0);
    const platformFee =
      req.body.platformFee !== undefined
        ? Number(req.body.platformFee)
        : Number((amount * 0.15).toFixed(2));
    const doctorEarning =
      req.body.doctorEarning !== undefined
        ? Number(req.body.doctorEarning)
        : Number((amount - platformFee).toFixed(2));

    const transaction = await Transaction.create({
      ...req.body,
      transactionReference:
        req.body.transactionReference || `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount,
      platformFee,
      doctorEarning,
    });

    if (transaction.appointmentId && transaction.status === "completed") {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "paid",
      });
    }

    await recordAudit(req, {
      action: "CREATE_TRANSACTION",
      module: "payment",
      targetType: "Transaction",
      targetId: transaction._id,
      details: {
        transactionReference: transaction.transactionReference,
        amount: transaction.amount,
        status: transaction.status,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const [summary, byMethod, monthlyBreakdown] = await Promise.all([
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalCompletedRevenue: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
            },
            totalPlatformFees: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$platformFee", 0] },
            },
            totalDoctorEarnings: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$doctorEarning", 0] },
            },
            totalRefundedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$refund.refundAmount", 0] },
            },
            completedCount: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            refundedCount: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] },
            },
            failedCount: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: "$paymentMethod",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: { $in: ["completed", "refunded"] } } },
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" },
            },
            grossAmount: { $sum: "$amount" },
            platformFee: { $sum: "$platformFee" },
            refundedAmount: { $sum: "$refund.refundAmount" },
            transactionsCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const payoutSummary = await DoctorPayout.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: summary[0] || {
          totalCompletedRevenue: 0,
          totalPlatformFees: 0,
          totalDoctorEarnings: 0,
          totalRefundedAmount: 0,
          completedCount: 0,
          refundedCount: 0,
          failedCount: 0,
        },
        paymentMethodBreakdown: byMethod,
        monthlyBreakdown,
        payoutSummary,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRefunds = async (req, res) => {
  try {
    const refunds = await Transaction.find({
      $or: [{ status: "refunded" }, { "refund.isRefunded": true }],
    }).sort({ "refund.refundedAt": -1, updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: refunds,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const processRefund = async (req, res) => {
  try {
    const { refundAmount, refundReason } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    if (transaction.status === "refunded") {
      return res.status(400).json({ success: false, message: "Transaction is already refunded" });
    }

    const finalRefundAmount =
      refundAmount !== undefined ? Number(refundAmount) : transaction.amount;

    transaction.status = "refunded";
    transaction.refund = {
      isRefunded: true,
      refundAmount: finalRefundAmount,
      refundReason: refundReason || "Refund processed by administrator",
      refundedAt: new Date(),
      refundReference: `REF-${Date.now()}`,
    };
    await transaction.save();

    if (transaction.appointmentId) {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "refunded",
      });
    }

    await recordAudit(req, {
      action: "PROCESS_REFUND",
      module: "payment",
      targetType: "Transaction",
      targetId: transaction._id,
      details: {
        transactionReference: transaction.transactionReference,
        refundAmount: finalRefundAmount,
        refundReason: transaction.refund.refundReason,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFailedPayments = async (req, res) => {
  try {
    const failedTransactions = await Transaction.find({ status: "failed" }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({
      success: true,
      data: failedTransactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFailedPaymentStatus = async (req, res) => {
  try {
    const { status, failureReason } = req.body;
    if (!["completed", "pending", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: completed, pending, failed",
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status,
        failureReason: status === "failed" ? failureReason || "" : "",
        paidAt: status === "completed" ? new Date() : undefined,
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.appointmentId && status === "completed") {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "paid",
      });
    }

    await recordAudit(req, {
      action: "UPDATE_PAYMENT_STATUS",
      module: "payment",
      targetType: "Transaction",
      targetId: transaction._id,
      details: { status, failureReason },
    });

    return res.status(200).json({
      success: true,
      message: "Payment status updated",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorPayouts = async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const payouts = await DoctorPayout.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDoctorPayout = async (req, res) => {
  try {
    const payout = await DoctorPayout.create(req.body);
    await recordAudit(req, {
      action: "CREATE_DOCTOR_PAYOUT",
      module: "payment",
      targetType: "DoctorPayout",
      targetId: payout._id,
      details: {
        doctorName: payout.doctorName,
        amount: payout.amount,
        status: payout.status,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Doctor payout initiated successfully",
      data: payout,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDoctorPayoutStatus = async (req, res) => {
  try {
    const { status, bankReference, notes } = req.body;
    if (!["pending", "processing", "paid", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payout status. Allowed: pending, processing, paid, failed",
      });
    }

    const payout = await DoctorPayout.findByIdAndUpdate(
      req.params.id,
      {
        status,
        bankReference: bankReference !== undefined ? bankReference : undefined,
        notes: notes !== undefined ? notes : undefined,
        processedAt: status === "paid" ? new Date() : undefined,
      },
      { new: true }
    );

    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout record not found" });
    }

    await recordAudit(req, {
      action: `DOCTOR_PAYOUT_${status.toUpperCase()}`,
      module: "payment",
      targetType: "DoctorPayout",
      targetId: payout._id,
      details: { status, bankReference },
    });

    return res.status(200).json({
      success: true,
      message: `Doctor payout marked as ${status}`,
      data: payout,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: specialties });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    await recordAudit(req, {
      action: "CREATE_SPECIALTY",
      module: "content",
      targetType: "Specialty",
      targetId: specialty._id,
      details: { name: specialty.name, code: specialty.code },
    });
    return res.status(201).json({
      success: true,
      message: "Medical specialty created",
      data: specialty,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!specialty) {
      return res.status(404).json({ success: false, message: "Specialty not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_SPECIALTY",
      module: "content",
      targetType: "Specialty",
      targetId: specialty._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Specialty updated",
      data: specialty,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) {
      return res.status(404).json({ success: false, message: "Specialty not found" });
    }
    await recordAudit(req, {
      action: "DELETE_SPECIALTY",
      module: "content",
      targetType: "Specialty",
      targetId: specialty._id,
      details: { name: specialty.name },
    });
    return res.status(200).json({ success: true, message: "Specialty deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    await recordAudit(req, {
      action: "CREATE_DEPARTMENT",
      module: "content",
      targetType: "Department",
      targetId: department._id,
      details: { name: department.name, code: department.code },
    });
    return res.status(201).json({
      success: true,
      message: "Department created",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_DEPARTMENT",
      module: "content",
      targetType: "Department",
      targetId: department._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Department updated",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    await recordAudit(req, {
      action: "DELETE_DEPARTMENT",
      module: "content",
      targetType: "Department",
      targetId: department._id,
      details: { name: department.name },
    });
    return res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const { category, isPublished } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    const faqs = await Faq.find(query).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    await recordAudit(req, {
      action: "CREATE_FAQ",
      module: "content",
      targetType: "Faq",
      targetId: faq._id,
      details: { question: faq.question },
    });
    return res.status(201).json({
      success: true,
      message: "FAQ created",
      data: faq,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_FAQ",
      module: "content",
      targetType: "Faq",
      targetId: faq._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "FAQ updated",
      data: faq,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    await recordAudit(req, {
      action: "DELETE_FAQ",
      module: "content",
      targetType: "Faq",
      targetId: faq._id,
      details: { question: faq.question },
    });
    return res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHealthArticles = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const articles = await HealthArticle.find(query).sort({ publishedAt: -1 });
    return res.status(200).json({ success: true, data: articles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createHealthArticle = async (req, res) => {
  try {
    const slug =
      req.body.slug ||
      String(req.body.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        `-${Date.now()}`;

    const article = await HealthArticle.create({
      ...req.body,
      slug,
      authorName: req.body.authorName || req.user?.username || "Medicare Editorial",
    });

    await recordAudit(req, {
      action: "CREATE_HEALTH_ARTICLE",
      module: "content",
      targetType: "HealthArticle",
      targetId: article._id,
      details: { title: article.title, status: article.status },
    });

    return res.status(201).json({
      success: true,
      message: "Health article created",
      data: article,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHealthArticle = async (req, res) => {
  try {
    const article = await HealthArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return res.status(404).json({ success: false, message: "Health article not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_HEALTH_ARTICLE",
      module: "content",
      targetType: "HealthArticle",
      targetId: article._id,
      details: { title: article.title, status: article.status },
    });
    return res.status(200).json({
      success: true,
      message: "Health article updated",
      data: article,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteHealthArticle = async (req, res) => {
  try {
    const article = await HealthArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Health article not found" });
    }
    await recordAudit(req, {
      action: "DELETE_HEALTH_ARTICLE",
      module: "content",
      targetType: "HealthArticle",
      targetId: article._id,
      details: { title: article.title },
    });
    return res.status(200).json({ success: true, message: "Health article deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { targetAudience, isActive } = req.query;
    const query = {};
    if (targetAudience) query.targetAudience = targetAudience;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    await recordAudit(req, {
      action: "CREATE_ANNOUNCEMENT",
      module: "content",
      targetType: "Announcement",
      targetId: announcement._id,
      details: { title: announcement.title, targetAudience: announcement.targetAudience },
    });
    return res.status(201).json({
      success: true,
      message: "Announcement published",
      data: announcement,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_ANNOUNCEMENT",
      module: "content",
      targetType: "Announcement",
      targetId: announcement._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Announcement updated",
      data: announcement,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    await recordAudit(req, {
      action: "DELETE_ANNOUNCEMENT",
      module: "content",
      targetType: "Announcement",
      targetId: announcement._id,
      details: { title: announcement.title },
    });
    return res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await RolePermission.find().sort({ roleName: 1 });
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertRolePermission = async (req, res) => {
  try {
    const { roleName, description, permissions, isSystemRole } = req.body;
    if (!roleName) {
      return res.status(400).json({ success: false, message: "roleName is required" });
    }

    const role = await RolePermission.findOneAndUpdate(
      { roleName: roleName.toLowerCase().trim() },
      {
        roleName: roleName.toLowerCase().trim(),
        description: description || "",
        permissions: Array.isArray(permissions) ? permissions : [],
        isSystemRole: Boolean(isSystemRole),
      },
      { upsert: true, new: true, runValidators: true }
    );

    await recordAudit(req, {
      action: "UPSERT_ROLE_PERMISSION",
      module: "system",
      targetType: "RolePermission",
      targetId: role._id,
      details: { roleName: role.roleName, permissions: role.permissions },
    });

    return res.status(200).json({
      success: true,
      message: "Role permissions saved",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRoleById = async (req, res) => {
  try {
    const role = await RolePermission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_ROLE_PERMISSION",
      module: "system",
      targetType: "RolePermission",
      targetId: role._id,
      details: { roleName: role.roleName, permissions: role.permissions },
    });
    return res.status(200).json({
      success: true,
      message: "Role updated",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRoleById = async (req, res) => {
  try {
    const role = await RolePermission.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    if (role.isSystemRole) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete a protected system role",
      });
    }
    await role.deleteOne();
    await recordAudit(req, {
      action: "DELETE_ROLE_PERMISSION",
      module: "system",
      targetType: "RolePermission",
      targetId: role._id,
      details: { roleName: role.roleName },
    });
    return res.status(200).json({ success: true, message: "Role deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRoleAndPermissions = async (req, res) => {
  try {
    const { role, permissions, isActive } = req.body;
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await recordAudit(req, {
      action: "UPDATE_USER_ROLE_PERMISSIONS",
      module: "system",
      targetType: "User",
      targetId: user._id,
      details: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "User role and permissions updated",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { module, action, actorId, startDate, endDate, page = 1, limit = 50 } = req.query;
    const query = {};
    if (module) query.module = module;
    if (action) query.action = { $regex: action, $options: "i" };
    if (actorId) query.actorId = actorId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
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

export const getNotifications = async (req, res) => {
  try {
    const { type, recipientRole, channel, status, isRead } = req.query;
    const query = {};
    if (type) query.type = type;
    if (recipientRole) query.recipientRole = recipientRole;
    if (channel) query.channel = channel;
    if (status) query.status = status;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      status: req.body.status || "sent",
    });

    await recordAudit(req, {
      action: "SEND_NOTIFICATION",
      module: "system",
      targetType: "Notification",
      targetId: notification._id,
      details: {
        title: notification.title,
        recipientRole: notification.recipientRole,
        channel: notification.channel,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    await recordAudit(req, {
      action: "DELETE_NOTIFICATION",
      module: "system",
      targetType: "Notification",
      targetId: notification._id,
      details: { title: notification.title },
    });
    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const settings = await SystemSetting.find(query).sort({ category: 1, key: 1 });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertSystemSettings = async (req, res) => {
  try {
    const items = Array.isArray(req.body.settings) ? req.body.settings : [req.body];
    const results = [];

    for (const item of items) {
      if (!item.key) continue;
      const updated = await SystemSetting.findOneAndUpdate(
        { key: item.key.trim() },
        {
          key: item.key.trim(),
          value: item.value,
          category: item.category || "general",
          description: item.description || "",
        },
        { upsert: true, new: true, runValidators: true }
      );
      results.push(updated);
    }

    await recordAudit(req, {
      action: "UPDATE_SYSTEM_SETTINGS",
      module: "system",
      targetType: "SystemSetting",
      details: { updatedKeys: results.map((r) => r.key) },
    });

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: results,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getSystemReports = async (req, res) => {
  try {
    const [
      doctorsByStatus,
      doctorsByDepartment,
      patientsByPlan,
      patientsByStatus,
      appointmentsByStatus,
      topDoctorsByAppointments,
      revenueByMonth,
      auditLogsByModule,
      contentCounts,
    ] = await Promise.all([
      Doctor.aggregate([
        {
          $group: {
            _id: {
              registrationStatus: "$registrationStatus",
              accountStatus: "$accountStatus",
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Doctor.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 }, avgFee: { $avg: "$fee" } } },
        { $sort: { count: -1 } },
      ]),
      Patient.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Patient.aggregate([{ $group: { _id: "$accountStatus", count: { $sum: 1 } } }]),
      Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Appointment.aggregate([
        {
          $group: {
            _id: { doctorId: "$doctorId", doctorName: "$doctorName" },
            totalAppointments: { $sum: 1 },
            completedAppointments: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            totalFeeGenerated: { $sum: "$fee" },
          },
        },
        { $sort: { totalAppointments: -1 } },
        { $limit: 10 },
      ]),
      Transaction.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" },
              status: "$status",
            },
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      AuditLog.aggregate([
        { $group: { _id: "$module", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Promise.all([
        Specialty.countDocuments(),
        Department.countDocuments(),
        Faq.countDocuments(),
        HealthArticle.countDocuments(),
        Announcement.countDocuments(),
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        generatedAt: new Date(),
        doctors: {
          byStatus: doctorsByStatus,
          byDepartment: doctorsByDepartment,
        },
        patients: {
          byPlan: patientsByPlan,
          byStatus: patientsByStatus,
        },
        appointments: {
          byStatus: appointmentsByStatus,
          topDoctors: topDoctorsByAppointments,
        },
        financials: {
          revenueByMonth,
        },
        contentSummary: {
          specialties: contentCounts[0],
          departments: contentCounts[1],
          faqs: contentCounts[2],
          healthArticles: contentCounts[3],
          announcements: contentCounts[4],
        },
        systemActivity: {
          auditLogsByModule,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
