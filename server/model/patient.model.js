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

const patientSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    age: { type: Number, default: 0 },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Unspecified"],
      default: "Unspecified",
    },
    bloodGroup: { type: String, default: "" },
    address: { type: String, default: "" },
    plan: {
      type: String,
      enum: ["Standard", "Premium Care", "Family Shield", "Senior Plus"],
      default: "Standard",
    },
    medicalConditions: { type: [String], default: [] },
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
