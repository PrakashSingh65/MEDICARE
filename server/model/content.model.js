import { model, Schema } from "mongoose";

const specialtySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    headDoctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    headDoctorName: { type: String, default: "" },
    description: { type: String, default: "" },
    floor: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: "General", trim: true },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const healthArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary: { type: String, default: "" },
    content: { type: String, required: true },
    authorName: { type: String, required: true, trim: true },
    category: { type: String, default: "Wellness", trim: true },
    tags: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const announcementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    targetAudience: {
      type: String,
      enum: ["all", "doctors", "patients", "admins"],
      default: "all",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Specialty = model("Specialty", specialtySchema);
export const Department = model("Department", departmentSchema);
export const Faq = model("Faq", faqSchema);
export const HealthArticle = model("HealthArticle", healthArticleSchema);
export const Announcement = model("Announcement", announcementSchema);
