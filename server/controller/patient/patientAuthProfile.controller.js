import crypto from "crypto";
import mongoose from "mongoose";
import User from "../../model/user.model.js";
import Patient from "../../model/patient.model.js";
import { UploadImage } from "../../utils/upload-image.js";
import { generateToken } from "../../utils/generate-token.js";
import { calculateAgeFromDob, resolvePatientRecord } from "../../utils/patientResolver.js";

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
