import mongoose from "mongoose";
import Doctor from "../model/doctor.model.js";

export const resolveDoctorRecord = async (req, autoCreate = false) => {
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
