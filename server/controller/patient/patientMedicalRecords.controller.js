import Prescription from "../../model/prescription.model.js";
import MedicalReport from "../../model/report.model.js";
import Consultation from "../../model/consultation.model.js";
import { UploadImage } from "../../utils/upload-image.js";
import { resolvePatientRecord } from "../../utils/patientResolver.js";

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
