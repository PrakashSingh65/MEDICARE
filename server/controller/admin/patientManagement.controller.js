import Patient from "../../model/patient.model.js";
import Appointment from "../../model/appointment.model.js";
import { Transaction } from "../../model/payment.model.js";
import User from "../../model/user.model.js";
import { recordAudit } from "../../utils/auditLogger.js";

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
