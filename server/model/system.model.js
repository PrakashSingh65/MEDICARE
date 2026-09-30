import { model, Schema } from "mongoose";

const rolePermissionSchema = new Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, default: "" },
    permissions: { type: [String], default: [] },
    isSystemRole: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const auditLogSchema = new Schema(
  {
    actorId: { type: String, required: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, default: "admin" },
    action: { type: String, required: true },
    module: {
      type: String,
      enum: ["dashboard", "doctor", "patient", "appointment", "payment", "content", "system", "auth"],
      required: true,
    },
    targetType: { type: String, default: "" },
    targetId: { type: String, default: "" },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

const notificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["system", "appointment", "payment", "verification", "announcement"],
      default: "system",
    },
    recipientRole: {
      type: String,
      enum: ["all", "admin", "doctor", "patient"],
      default: "all",
    },
    recipientId: { type: Schema.Types.ObjectId, ref: "User" },
    channel: {
      type: String,
      enum: ["in_app", "email", "sms", "push"],
      default: "in_app",
    },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "sent",
    },
    isRead: { type: Boolean, default: false },
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const systemSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ["general", "booking", "payment", "security", "notifications", "maintenance"],
      default: "general",
    },
    description: { type: String, default: "" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const RolePermission = model("RolePermission", rolePermissionSchema);
export const AuditLog = model("AuditLog", auditLogSchema);
export const Notification = model("Notification", notificationSchema);
export const SystemSetting = model("SystemSetting", systemSettingSchema);
