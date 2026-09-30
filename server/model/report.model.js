import { model, Schema } from "mongoose";

const medicalReportSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, required: true, trim: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    doctorName: { type: String, default: "" },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    consultationId: { type: Schema.Types.ObjectId, ref: "Consultation" },
    title: { type: String, required: true, trim: true },
    reportType: {
      type: String,
      enum: ["lab", "radiology", "pathology", "cardiology", "discharge_summary", "other"],
      default: "lab",
    },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, default: "" },
    uploadedByRole: {
      type: String,
      enum: ["doctor", "patient", "admin"],
      default: "doctor",
    },
    interpretation: { type: String, default: "" },
    notes: { type: String, default: "" },
    criticalFlag: { type: Boolean, default: false },
    interpretedAt: { type: Date },
    reportDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const MedicalReport = model("MedicalReport", medicalReportSchema);

export default MedicalReport;
