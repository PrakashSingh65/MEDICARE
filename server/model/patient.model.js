import { model, Schema } from "mongoose";

const activityItemSchema = new Schema(
  {
    action: { type: String, required: true },
    ipAddress: { type: String, default: "" },
    device: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const medicalHistoryItemSchema = new Schema(
  {
    condition: { type: String, required: true, trim: true },
    diagnosedDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "resolved", "chronic"],
      default: "active",
    },
    notes: { type: String, default: "" },
  },
  { _id: true }
);

const currentMedicationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dosage: { type: String, default: "" },
    frequency: { type: String, default: "" },
    startedAt: { type: Date, default: Date.now },
    prescribedBy: { type: String, default: "" },
  },
  { _id: true }
);

const patientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    dateOfBirth: { type: Date },
    age: { type: Number, default: 0 },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Unspecified"],
      default: "Unspecified",
    },
    bloodGroup: { type: String, default: "" },
    address: { type: String, default: "" },
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
    imageUrlId: { type: String, default: "" },
    emergencyContact: {
      name: { type: String, default: "" },
      relationship: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    plan: {
      type: String,
      enum: ["Standard", "Premium Care", "Family Shield", "Senior Plus"],
      default: "Standard",
    },
    medicalConditions: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    currentMedications: [currentMedicationSchema],
    medicalHistory: [medicalHistoryItemSchema],
    accountStatus: {
      type: String,
      enum: ["active", "deactivated"],
      default: "active",
    },
    statusReason: { type: String, default: "" },
    lastLoginAt: { type: Date, default: Date.now },
    activityLog: [activityItemSchema],
  },
  { timestamps: true }
);

const Patient = model("Patient", patientSchema);

export default Patient;
