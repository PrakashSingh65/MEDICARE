import Consultation from "../../model/consultation.model.js";
import { UploadImage } from "../../utils/upload-image.js";
import { resolvePatientRecord } from "../../utils/patientResolver.js";

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
