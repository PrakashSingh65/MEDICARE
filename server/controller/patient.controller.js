import crypto from "crypto";
import mongoose from "mongoose";
import User from "../model/user.model.js";
import Patient from "../model/patient.model.js";
import Doctor from "../model/doctor.model.js";
import Appointment from "../model/appointment.model.js";
import Consultation from "../model/consultation.model.js";
import Prescription from "../model/prescription.model.js";
import MedicalReport from "../model/report.model.js";
import { Transaction } from "../model/payment.model.js";
import { Notification } from "../model/system.model.js";
import { UploadImage } from "../utils/upload-image.js";
import { generateToken } from "../utils/generate-token.js";
import { buildPrescriptionPdfBuffer } from "../utils/generate-prescription-pdf.js";
import { buildInvoicePdfBuffer } from "../utils/generate-invoice-pdf.js";

const calculateAgeFromDob = (dob) => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
};

const resolvePatientRecord = async (req, autoCreate = false) => {
  const explicitPatientId =
    req.query?.patientId || req.body?.patientId || req.params?.patientId;
  if (explicitPatientId && mongoose.Types.ObjectId.isValid(explicitPatientId)) {
    const byId = await Patient.findById(explicitPatientId);
    if (byId) return byId;
  }

  const userId = req.user?._id || req.user?.id;
  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    const byUserId = await Patient.findOne({ userId });
    if (byUserId) return byUserId;
  }

  if (req.user?.email) {
    const byEmail = await Patient.findOne({ email: req.user.email.toLowerCase().trim() });
    if (byEmail) return byEmail;
  }

  if (autoCreate && req.user?.email) {
    return await Patient.create({
      userId: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
      name: req.user.username || "Medicare Patient",
      email: req.user.email.toLowerCase().trim(),
      imageUrl: req.user.imageUrl,
      activityLog: [
        {
          action: "Patient profile initialized",
          ipAddress: req.ip || "",
          device: req.headers["user-agent"] || "",
          timestamp: new Date(),
        },
      ],
    });
  }

  return null;
};

export const registerPatient = async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      emergencyContact,
    } = req.body;

    const resolvedName = (name || username || "").trim();
    if (!resolvedName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name/username, email, and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: resolvedName }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email or username already exists",
      });
    }

    let profileUrl =
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200";
    let profilePublicId = "";

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-patient-profiles", baseUrl);
      if (uploaded?.secure_url) {
        profileUrl = uploaded.secure_url;
        profilePublicId = uploaded.public_id || "";
      }
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const user = await User.create({
      username: resolvedName,
      email: cleanEmail,
      phone: phone || "",
      password,
      role: "patient",
      imageUrl: profileUrl,
      imageUrlId: profilePublicId,
      verificationOtp: otp,
      verificationOtpExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const parsedEmergencyContact =
      typeof emergencyContact === "string"
        ? JSON.parse(emergencyContact)
        : emergencyContact || {};

    const patient = await Patient.create({
      userId: user._id,
      name: resolvedName,
      email: cleanEmail,
      phone: phone || "",
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      age: dateOfBirth ? calculateAgeFromDob(dateOfBirth) : Number(req.body.age || 0),
      gender: gender || "Unspecified",
      bloodGroup: bloodGroup || "",
      address: address || "",
      imageUrl: profileUrl,
      imageUrlId: profilePublicId,
      emergencyContact: parsedEmergencyContact,
      activityLog: [
        {
          action: "Patient registered account",
          ipAddress: req.ip || "",
          device: req.headers["user-agent"] || "",
          timestamp: new Date(),
        },
      ],
    });

    generateToken(user, res);

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          imageUrl: user.imageUrl,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
        patient,
        verificationOtpPreview: otp,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    let patient = await Patient.findOne({
      $or: [{ userId: user._id }, { email: cleanEmail }],
    });

    if (patient) {
      if (patient.accountStatus === "deactivated") {
        return res.status(403).json({
          success: false,
          message: "Patient account is deactivated",
        });
      }
      patient.lastLoginAt = new Date();
      patient.activityLog.push({
        action: "Patient logged in",
        ipAddress: req.ip || "",
        device: req.headers["user-agent"] || "",
        timestamp: new Date(),
      });
      await patient.save();
    }

    generateToken(user, res);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role === "user" ? "patient" : user.role,
          imageUrl: user.imageUrl,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
        },
        patient,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutPatient = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const sendVerificationCode = async (req, res) => {
  try {
    const { email, phone, channel = "email" } = req.body;
    const query = {};
    if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
      query._id = req.user._id;
    } else if (email) {
      query.email = email.trim().toLowerCase();
    } else if (phone) {
      query.phone = phone.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: "email or phone is required",
      });
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verificationOtp = otp;
    user.verificationOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Verification code sent via ${channel}`,
      data: {
        channel,
        expiresAt: user.verificationOtpExpires,
        otpPreview: otp,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmailOrPhone = async (req, res) => {
  try {
    const { email, phone, otp, type = "email" } = req.body;
    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const query = {};
    if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
      query._id = req.user._id;
    } else if (email) {
      query.email = email.trim().toLowerCase();
    } else if (phone) {
      query.phone = phone.trim();
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (
      !user.verificationOtp ||
      user.verificationOtp !== String(otp).trim() ||
      (user.verificationOtpExpires && user.verificationOtpExpires < new Date())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    if (type === "phone") {
      user.isPhoneVerified = true;
    } else {
      user.isEmailVerified = true;
    }
    user.verificationOtp = "";
    user.verificationOtpExpires = undefined;
    await user.save();

    await Patient.findOneAndUpdate(
      { $or: [{ userId: user._id }, { email: user.email }] },
      {
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      }
    );

    return res.status(200).json({
      success: true,
      message: `${type === "phone" ? "Phone" : "Email"} verified successfully`,
      data: {
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email address",
      });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset token generated",
      data: {
        resetToken,
        expiresAt: user.resetPasswordExpires,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and newPassword are required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const editableFields = [
      "name",
      "phone",
      "gender",
      "bloodGroup",
      "address",
      "plan",
      "allergies",
      "medicalConditions",
    ];

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    }

    if (req.body.dateOfBirth !== undefined) {
      patient.dateOfBirth = req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined;
      patient.age = calculateAgeFromDob(req.body.dateOfBirth);
    } else if (req.body.age !== undefined) {
      patient.age = Number(req.body.age);
    }

    if (req.body.emergencyContact !== undefined) {
      const parsedContact =
        typeof req.body.emergencyContact === "string"
          ? JSON.parse(req.body.emergencyContact)
          : req.body.emergencyContact;
      patient.emergencyContact = {
        ...patient.emergencyContact,
        ...parsedContact,
      };
    }

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-patient-profiles", baseUrl);
      if (uploaded?.secure_url) {
        patient.imageUrl = uploaded.secure_url;
        patient.imageUrlId = uploaded.public_id || "";
      }
    } else if (req.body.imageUrl) {
      patient.imageUrl = req.body.imageUrl;
    }

    patient.activityLog.push({
      action: "Updated patient profile",
      ipAddress: req.ip || "",
      device: req.headers["user-agent"] || "",
      timestamp: new Date(),
    });

    await patient.save();

    if (patient.userId) {
      await User.findByIdAndUpdate(patient.userId, {
        username: patient.name,
        phone: patient.phone,
        imageUrl: patient.imageUrl,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      data: patient,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

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

    const doctor = await Doctor.findById(doctorId);
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

    const now = new Date();
    const appointments = await Appointment.find({
      patientId: patient._id,
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

export const getMedicalHistoryAndRecords = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const [prescriptions, reports, consultations] = await Promise.all([
      Prescription.find({ patientId: patient._id }).sort({ issuedAt: -1 }),
      MedicalReport.find({ patientId: patient._id }).sort({ reportDate: -1 }),
      Consultation.find({ patientId: patient._id }).sort({ createdAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        medicalHistory: patient.medicalHistory,
        medicalConditions: patient.medicalConditions,
        allergies: patient.allergies,
        currentMedications: patient.currentMedications,
        prescriptions,
        reports,
        consultations,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadPatientMedicalDocument = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { title, reportType, notes, reportDate, doctorId, appointmentId } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "title is required" });
    }

    let fileUrl = req.body.fileUrl || "";
    let filePublicId = "";

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-patient-documents", baseUrl);
      if (uploaded?.secure_url) {
        fileUrl = uploaded.secure_url;
        filePublicId = uploaded.public_id || "";
      }
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "A document file upload or fileUrl is required",
      });
    }

    const report = await MedicalReport.create({
      patientId: patient._id,
      patientName: patient.name,
      doctorId: doctorId || undefined,
      appointmentId: appointmentId || undefined,
      title,
      reportType: reportType || "lab",
      fileUrl,
      filePublicId,
      uploadedByRole: "patient",
      notes: notes || "",
      reportDate: reportDate ? new Date(reportDate) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Medical document uploaded successfully",
      data: report,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientLabReports = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { reportType } = req.query;
    const query = { patientId: patient._id };
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

export const downloadMedicalDocument = async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Medical document not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: report._id,
        title: report.title,
        reportType: report.reportType,
        downloadUrl: report.fileUrl,
        interpretation: report.interpretation,
        notes: report.notes,
        reportDate: report.reportDate,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const trackPreviousDiagnoses = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const [consultations, prescriptions] = await Promise.all([
      Consultation.find({
        patientId: patient._id,
        diagnosis: { $ne: "" },
      })
        .select("doctorName diagnosis symptoms treatmentPlan followUpDate createdAt")
        .sort({ createdAt: -1 }),
      Prescription.find({
        patientId: patient._id,
        diagnosis: { $ne: "" },
      })
        .select("prescriptionNumber doctorName diagnosis symptoms medicines issuedAt")
        .sort({ issuedAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        recordedMedicalHistory: patient.medicalHistory,
        consultationDiagnoses: consultations,
        prescriptionDiagnoses: prescriptions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const joinOrStartVideoConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    if (!consultation.videoSession.roomId) {
      const roomId = `medicare-video-${Date.now()}`;
      consultation.videoSession.roomId = roomId;
      consultation.videoSession.meetingUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/consultation/video/${roomId}`;
    }
    consultation.consultationMode = "video";
    consultation.videoSession.status = "active";
    if (!consultation.videoSession.startedAt) {
      consultation.videoSession.startedAt = new Date();
    }
    await consultation.save();

    return res.status(200).json({
      success: true,
      message: "Joined video consultation",
      data: consultation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const joinOrStartAudioConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    if (!consultation.audioSession.roomId) {
      const roomId = `medicare-audio-${Date.now()}`;
      consultation.audioSession.roomId = roomId;
      consultation.audioSession.callUrl = `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/consultation/audio/${roomId}`;
    }
    consultation.consultationMode = "audio";
    consultation.audioSession.status = "active";
    if (!consultation.audioSession.startedAt) {
      consultation.audioSession.startedAt = new Date();
    }
    await consultation.save();

    return res.status(200).json({
      success: true,
      message: "Joined audio consultation",
      data: consultation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientConsultationChat = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        chatMessages: consultation.chatMessages,
        sharedFiles: consultation.sharedFiles,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendPatientConsultationChat = async (req, res) => {
  try {
    const { message, attachmentUrl } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "message is required" });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    consultation.chatMessages.push({
      senderId: String(req.user?._id || req.user?.id || consultation.patientId),
      senderRole: "patient",
      senderName: req.user?.username || consultation.patientName,
      message: message.trim(),
      attachmentUrl: attachmentUrl || "",
      sentAt: new Date(),
    });

    await consultation.save();

    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: consultation.chatMessages[consultation.chatMessages.length - 1],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const shareConsultationDocument = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    let fileUrl = req.body.fileUrl || "";
    let fileName = req.body.fileName || "shared-document";
    let fileType = req.body.fileType || "document";

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-consultation-files", baseUrl);
      if (uploaded?.secure_url) {
        fileUrl = uploaded.secure_url;
        fileName = uploadedFile.originalname || fileName;
        fileType = uploadedFile.mimetype || fileType;
      }
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File upload or fileUrl is required",
      });
    }

    const sharedEntry = {
      uploadedById: String(req.user?._id || req.user?.id || consultation.patientId),
      uploadedByRole: "patient",
      uploadedByName: req.user?.username || consultation.patientName,
      fileName,
      fileUrl,
      fileType,
      sharedAt: new Date(),
    };

    consultation.sharedFiles.push(sharedEntry);
    consultation.chatMessages.push({
      senderId: sharedEntry.uploadedById,
      senderRole: "patient",
      senderName: sharedEntry.uploadedByName,
      message: `Shared file: ${fileName}`,
      attachmentUrl: fileUrl,
      sentAt: new Date(),
    });

    await consultation.save();

    return res.status(201).json({
      success: true,
      message: "Document shared in consultation",
      data: consultation.sharedFiles[consultation.sharedFiles.length - 1],
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientConsultationHistory = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const consultations = await Consultation.find({ patientId: patient._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const prescriptions = await Prescription.find({ patientId: patient._id }).sort({
      issuedAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientPrescriptionDetail = async (req, res) => {
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

export const downloadPatientPrescriptionPdf = async (req, res) => {
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

export const payConsultationFee = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { appointmentId, doctorId, amount, paymentMethod = "upi" } = req.body;
    let appointment = null;
    if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
      appointment = await Appointment.findById(appointmentId);
    }

    const resolvedDoctorId = appointment?.doctorId || doctorId;
    const doctor = resolvedDoctorId ? await Doctor.findById(resolvedDoctorId) : null;
    const finalAmount = Number(amount || appointment?.fee || doctor?.fee || 500);
    const platformFee = Number((finalAmount * 0.15).toFixed(2));
    const doctorEarning = Number((finalAmount - platformFee).toFixed(2));

    const transaction = await Transaction.create({
      transactionReference: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appointmentId: appointment?._id,
      patientId: patient._id,
      patientName: patient.name,
      doctorId: doctor?._id || resolvedDoctorId,
      doctorName: doctor?.name || appointment?.doctorName || "Doctor",
      amount: finalAmount,
      platformFee,
      doctorEarning,
      paymentMethod,
      status: "completed",
      paidAt: new Date(),
    });

    if (appointment) {
      appointment.paymentStatus = "paid";
      if (appointment.status === "pending" || appointment.status === "scheduled") {
        appointment.status = "confirmed";
      }
      await appointment.save();
    }

    await Notification.create({
      title: "Consultation Fee Payment Successful",
      message: `Payment of INR ${finalAmount} (${transaction.transactionReference}) was completed successfully.`,
      type: "payment",
      recipientRole: "patient",
      patientId: patient._id,
      doctorId: doctor?._id,
      metadata: {
        transactionId: transaction._id,
        transactionReference: transaction.transactionReference,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Consultation fee paid successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientPaymentHistory = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const transactions = await Transaction.find({ patientId: patient._id }).sort({
      paidAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentInvoiceReceipt = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (req.query.format === "pdf") {
      const pdfBuffer = buildInvoicePdfBuffer(transaction);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="INV-${transaction.transactionReference}.pdf"`
      );
      return res.status(200).send(pdfBuffer);
    }

    return res.status(200).json({
      success: true,
      data: {
        invoiceNumber: `INV-${transaction.transactionReference}`,
        transactionReference: transaction.transactionReference,
        patientName: transaction.patientName,
        doctorName: transaction.doctorName,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        paidAt: transaction.paidAt,
        refund: transaction.refund,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientRefundStatus = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const refundedTransactions = await Transaction.find({
      patientId: patient._id,
      $or: [{ status: "refunded" }, { "refund.isRefunded": true }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: refundedTransactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestPaymentRefund = async (req, res) => {
  try {
    const { refundReason } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    transaction.refund = {
      isRefunded: true,
      refundAmount: transaction.amount,
      refundReason: refundReason || "Requested by patient",
      refundedAt: new Date(),
      refundReference: `REF-${Date.now()}`,
    };
    transaction.status = "refunded";
    await transaction.save();

    if (transaction.appointmentId) {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "refunded",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientNotifications = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    const { type, isRead } = req.query;

    const orConditions = [{ recipientRole: { $in: ["all", "patient"] } }];
    if (patient?._id) {
      orConditions.push({ patientId: patient._id });
    }
    if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
      orConditions.push({ recipientId: req.user._id });
    }

    const query = { $or: orConditions };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotificationsByCategory = (categoryTypes) => async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    const orConditions = [{ recipientRole: { $in: ["all", "patient"] } }];
    if (patient?._id) {
      orConditions.push({ patientId: patient._id });
    }
    if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
      orConditions.push({ recipientId: req.user._id });
    }

    const notifications = await Notification.find({
      $or: orConditions,
      type: { $in: categoryTypes },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markPatientNotificationRead = async (req, res) => {
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
