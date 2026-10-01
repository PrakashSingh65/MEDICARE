import Prescription from "../../model/prescription.model.js";
import Patient from "../../model/patient.model.js";
import { resolveDoctorRecord } from "../../utils/doctorResolver.js";
import { buildPrescriptionPdfBuffer } from "../../utils/generate-prescription-pdf.js";

export const createPrescription = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const {
      consultationId,
      appointmentId,
      patientId,
      patientName,
      diagnosis,
      symptoms,
      medicines,
      generalInstructions,
      followUpDate,
    } = req.body;

    if (!patientId || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "patientId and at least one medicine are required",
      });
    }

    const patient = await Patient.findById(patientId);
    const qualificationsStr = (doctor.qualifications || [])
      .map((q) => q.degree)
      .filter(Boolean)
      .join(", ");

    const prescription = await Prescription.create({
      prescriptionNumber: `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      consultationId,
      appointmentId,
      doctorId: doctor._id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorQualifications: qualificationsStr,
      clinicName: doctor.clinicInfo?.clinicName || doctor.clinicInfo?.hospitalAffiliation || "Medicare Clinic",
      patientId,
      patientName: patient?.name || patientName || "Patient",
      patientAge: patient?.age || 0,
      patientGender: patient?.gender || "",
      diagnosis: diagnosis || "",
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      medicines,
      generalInstructions: generalInstructions || "",
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      issuedAt: new Date(),
    });

    if (patient) {
      medicines.forEach((m) => {
        patient.currentMedications.push({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          startedAt: new Date(),
          prescribedBy: doctor.name,
        });
      });
      await patient.save();
    }

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPrescriptionHistory = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const { patientId, appointmentId, search } = req.query;
    const query = { doctorId: doctor._id };
    if (patientId) query.patientId = patientId;
    if (appointmentId) query.appointmentId = appointmentId;
    if (search) {
      query.$or = [
        { prescriptionNumber: { $regex: search, $options: "i" } },
        { patientName: { $regex: search, $options: "i" } },
        { diagnosis: { $regex: search, $options: "i" } },
      ];
    }

    const prescriptions = await Prescription.find(query).sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
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

export const generatePrescriptionPdf = async (req, res) => {
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
