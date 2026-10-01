import { model, Schema } from "mongoose";

const chatMessageSchema = new Schema(
  {
    senderId: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ["doctor", "patient"],
      required: true,
    },
    senderName: { type: String, required: true },
    message: { type: String, required: true, trim: true },
    attachmentUrl: { type: String, default: "" },
    sentAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const sharedFileSchema = new Schema(
  {
    uploadedById: { type: String, required: true },
    uploadedByRole: {
      type: String,
      enum: ["doctor", "patient"],
      required: true,
    },
    uploadedByName: { type: String, default: "" },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "image" },
    sharedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const consultationSchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: { type: String, required: true, trim: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, required: true, trim: true },
    consultationMode: {
      type: String,
      enum: ["video", "audio", "chat"],
      default: "video",
    },
    videoSession: {
      roomId: { type: String, default: "" },
      meetingUrl: { type: String, default: "" },
      status: {
        type: String,
        enum: ["not_started", "active", "ended"],
        default: "not_started",
      },
      startedAt: { type: Date },
      endedAt: { type: Date },
    },
    audioSession: {
      roomId: { type: String, default: "" },
      callUrl: { type: String, default: "" },
      status: {
        type: String,
        enum: ["not_started", "active", "ended"],
        default: "not_started",
      },
      startedAt: { type: Date },
      endedAt: { type: Date },
    },
    chatMessages: [chatMessageSchema],
    sharedFiles: [sharedFileSchema],
    symptoms: { type: [String], default: [] },
    diagnosis: { type: String, default: "" },
    consultationNotes: { type: String, default: "" },
    treatmentPlan: { type: String, default: "" },
    vitals: {
      bloodPressure: { type: String, default: "" },
      heartRate: { type: String, default: "" },
      temperature: { type: String, default: "" },
      spo2: { type: String, default: "" },
      weight: { type: String, default: "" },
    },
    followUpDate: { type: Date },
    status: {
      type: String,
      enum: ["in_progress", "completed", "cancelled"],
      default: "in_progress",
    },
  },
  { timestamps: true }
);

const Consultation = model("Consultation", consultationSchema);

export default Consultation;
