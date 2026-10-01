import MedicalReport from "../../model/report.model.js";
import Patient from "../../model/patient.model.js";
import { resolveDoctorRecord } from "../../utils/doctorResolver.js";
import { UploadImage } from "../../utils/upload-image.js";

export const uploadMedicalReport = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const {
      patientId,
      patientName,
      appointmentId,
      consultationId,
      title,
      reportType,
      interpretation,
      notes,
      criticalFlag,
      reportDate,
    } = req.body;

    if (!patientId || !title) {
      return res.status(400).json({
        success: false,
        message: "patientId and title are required",
      });
    }

    let fileUrl = req.body.fileUrl || "";
    let filePublicId = "";

    const uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (uploadedFile) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const uploaded = await UploadImage(uploadedFile, "medicare-medical-reports", baseUrl);
      if (uploaded?.secure_url) {
        fileUrl = uploaded.secure_url;
        filePublicId = uploaded.public_id || "";
      }
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "A report file upload or fileUrl is required",
      });
    }

    const patient = await Patient.findById(patientId);

    const report = await MedicalReport.create({
      patientId,
      patientName: patient?.name || patientName || "Patient",
      doctorId: doctor._id,
      doctorName: doctor.name,
      appointmentId,
      consultationId,
      title,
      reportType: reportType || "lab",
      fileUrl,
      filePublicId,
      uploadedByRole: "doctor",
      interpretation: interpretation || "",
      notes: notes || "",
      criticalFlag: Boolean(criticalFlag),
      interpretedAt: interpretation ? new Date() : undefined,
      reportDate: reportDate ? new Date(reportDate) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Medical report uploaded successfully",
      data: report,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientReports = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { patientId, reportType } = req.query;
    const query = {};
    if (patientId) {
      query.patientId = patientId;
    } else {
      query.doctorId = doctor._id;
    }
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

export const addReportInterpretation = async (req, res) => {
  try {
    const { interpretation, notes, criticalFlag } = req.body;
    const report = await MedicalReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Medical report not found" });
    }

    if (interpretation !== undefined) report.interpretation = interpretation;
    if (notes !== undefined) report.notes = notes;
    if (criticalFlag !== undefined) report.criticalFlag = Boolean(criticalFlag);
    report.interpretedAt = new Date();

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report interpretation and notes saved",
      data: report,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
