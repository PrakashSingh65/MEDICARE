import { model, Schema } from "mongoose";

const rescheduleLogSchema = new Schema(
  {
    previousDate: { type: Date },
    previousTimeSlot: { type: String },
    newDate: { type: Date, required: true },
    newTimeSlot: { type: String, required: true },
    reason: { type: String, default: "" },
    rescheduledBy: { type: String, default: "doctor" },
    rescheduledAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const reminderItemSchema = new Schema(
  {
    reminderTime: { type: Date, required: true },
    message: { type: String, default: "Upcoming medical appointment reminder" },
    channel: {
      type: String,
      enum: ["in_app", "email", "sms"],
      default: "in_app",
    },
    isSent: { type: Boolean, default: false },
  },
  { _id: true }
);

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
    consultationType: {
      type: String,
      enum: ["in_clinic", "video", "audio", "chat"],
      default: "video",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "scheduled",
        "confirmed",
        "accepted",
        "rejected",
        "rescheduled",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
        "no_show",
      ],
      default: "scheduled",
    },
    fee: { type: Number, required: true, default: 500 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
    reasonForVisit: { type: String, default: "" },
    rejectionReason: { type: String, default: "" },
    cancellationReason: { type: String, default: "" },
    cancelledBy: { type: String, default: "" },
    cancelledAt: { type: Date },
    rescheduleHistory: [rescheduleLogSchema],
    reminders: [reminderItemSchema],
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
