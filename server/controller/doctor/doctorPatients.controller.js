import Patient from "../../model/patient.model.js";
import Appointment from "../../model/appointment.model.js";
import Consultation from "../../model/consultation.model.js";
import Prescription from "../../model/prescription.model.js";
import MedicalReport from "../../model/report.model.js";
import { resolveDoctorRecord } from "../../utils/doctorResolver.js";

export const getDoctorPatients = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const patientIds = await Appointment.distinct("patientId", { doctorId: doctor._id });
    const { search } = req.query;

    const query =
      patientIds.length > 0
        ? { _id: { $in: patientIds } }
        : {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(query).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientMedicalRecord = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const [previousConsultations, previousPrescriptions, uploadedReports, appointments] =
      await Promise.all([
        Consultation.find({ patientId: patient._id }).sort({ createdAt: -1 }),
        Prescription.find({ patientId: patient._id }).sort({ issuedAt: -1 }),
        MedicalReport.find({ patientId: patient._id }).sort({ reportDate: -1 }),
        Appointment.find({ patientId: patient._id }).sort({ appointmentDate: -1 }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        patient,
        medicalHistory: patient.medicalHistory,
        medicalConditions: patient.medicalConditions,
        allergies: patient.allergies,
        currentMedications: patient.currentMedications,
        previousConsultations,
        previousPrescriptions,
        uploadedReports,
        appointments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatientClinicalInfo = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const { allergies, currentMedications, medicalHistory, medicalConditions } = req.body;
    if (Array.isArray(allergies)) patient.allergies = allergies;
    if (Array.isArray(currentMedications)) patient.currentMedications = currentMedications;
    if (Array.isArray(medicalHistory)) patient.medicalHistory = medicalHistory;
    if (Array.isArray(medicalConditions)) patient.medicalConditions = medicalConditions;

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient clinical profile updated",
      data: patient,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
