import { resolveDoctorRecord } from "../../utils/doctorResolver.js";
import { UploadImage } from "../../utils/upload-image.js";

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
