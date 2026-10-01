import mongoose from "mongoose";
import Patient from "../model/patient.model.js";

export const calculateAgeFromDob = (dob) => {
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

export const resolvePatientRecord = async (req, autoCreate = false) => {
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
