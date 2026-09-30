import { model, Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionReference: { type: String, required: true, unique: true, trim: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
    patientName: { type: String, required: true, trim: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    doctorName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    doctorEarning: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "cash"],
      default: "upi",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed", "refunded"],
      default: "completed",
    },
    failureReason: { type: String, default: "" },
    refund: {
      isRefunded: { type: Boolean, default: false },
      refundAmount: { type: Number, default: 0 },
      refundReason: { type: String, default: "" },
      refundedAt: { type: Date },
      refundedBy: { type: Schema.Types.ObjectId, ref: "User" },
      refundReference: { type: String, default: "" },
    },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const doctorPayoutSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },
    bankReference: { type: String, default: "" },
    notes: { type: String, default: "" },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);
export const DoctorPayout = model("DoctorPayout", doctorPayoutSchema);
