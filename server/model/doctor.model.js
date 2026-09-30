import { model, Schema } from "mongoose";

const qualificationSchema = new Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    documentUrl: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: true }
);

const slotItemSchema = new Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { _id: true }
);

const customDateSlotSchema = new Schema(
  {
    date: { type: Date, required: true },
    slots: [slotItemSchema],
  },
  { _id: true }
);

const blockedDateSchema = new Schema(
  {
    date: { type: Date, required: true },
    reason: { type: String, default: "" },
  },
  { _id: true }
);

const vacationSchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { _id: true }
);

const doctorSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    specialty: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    experience: { type: Number, default: 0 },
    fee: { type: Number, required: true, default: 500 },
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    },
    bio: { type: String, default: "" },
    languages: {
      type: [String],
      default: ["English"],
    },
    clinicInfo: {
      clinicName: { type: String, default: "" },
      hospitalAffiliation: { type: String, default: "" },
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      contactPhone: { type: String, default: "" },
      consultationType: {
        type: [String],
        default: ["in_clinic", "video"],
      },
    },
    registrationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    qualifications: [qualificationSchema],
    isQualifiedVerified: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
    },
    suspensionReason: { type: String, default: "" },
    availability: {
      days: { type: [String], default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
      startTime: { type: String, default: "09:00" },
      endTime: { type: String, default: "17:00" },
      breakStart: { type: String, default: "13:00" },
      breakEnd: { type: String, default: "14:00" },
      slotDurationMinutes: { type: Number, default: 30 },
    },
    customSlots: [customDateSlotSchema],
    blockedDates: [blockedDateSchema],
    vacations: [vacationSchema],
    rating: { type: Number, default: 0 },
    totalConsultations: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Doctor = model("Doctor", doctorSchema);

export default Doctor;
