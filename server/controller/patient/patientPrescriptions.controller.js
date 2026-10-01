import Prescription from "../../model/prescription.model.js";
import { buildPrescriptionPdfBuffer } from "../../utils/generate-prescription-pdf.js";
import { resolvePatientRecord } from "../../utils/patientResolver.js";

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
