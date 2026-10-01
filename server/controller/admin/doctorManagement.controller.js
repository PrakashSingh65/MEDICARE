import Doctor from "../../model/doctor.model.js";
import Appointment from "../../model/appointment.model.js";
import { DoctorPayout } from "../../model/payment.model.js";
import User from "../../model/user.model.js";
import { recordAudit } from "../../utils/auditLogger.js";

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
