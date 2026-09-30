import { model, Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, required: true, trim: true },
    patientEmail: { type: String, trim: true, default: "" },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true, trim: true },
    specialty: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "disputed", "no_show"],
      default: "scheduled",
    },
    fee: { type: Number, required: true, default: 500 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    cancellationReason: { type: String, default: "" },
    cancelledBy: { type: String, default: "" },
    cancelledAt: { type: Date },
    issue: {
      hasIssue: { type: Boolean, default: false },
      description: { type: String, default: "" },
      status: {
        type: String,
        enum: ["none", "open", "investigating", "resolved"],
        default: "none",
      },
      resolutionNotes: { type: String, default: "" },
      resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
      resolvedAt: { type: Date },
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;
