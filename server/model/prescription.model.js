import { model, Schema } from "mongoose";

const prescribedMedicineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    route: { type: String, default: "Oral" },
    timing: { type: String, default: "After Meal" },
    instructions: { type: String, default: "" },
  },
  { _id: true }
);

const prescriptionSchema = new Schema(
  {
    prescriptionNumber: { type: String, required: true, unique: true, trim: true },
    consultationId: { type: Schema.Types.ObjectId, ref: "Consultation" },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true, trim: true },
    doctorSpecialty: { type: String, default: "" },
    doctorQualifications: { type: String, default: "" },
    clinicName: { type: String, default: "" },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, required: true, trim: true },
    patientAge: { type: Number, default: 0 },
    patientGender: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    symptoms: { type: [String], default: [] },
    medicines: {
      type: [prescribedMedicineSchema],
      validate: [(arr) => arr.length > 0, "At least one medicine is required"],
    },
    generalInstructions: { type: String, default: "" },
    followUpDate: { type: Date },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Prescription = model("Prescription", prescriptionSchema);

export default Prescription;
