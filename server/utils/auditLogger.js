import { AuditLog } from "../model/system.model.js";

export const recordAudit = async (req, payload) => {
  try {
    const actorId = String(req.user?._id || req.user?.id || "system");
    const actorName = req.user?.username || req.user?.email || "Administrator";
    const actorRole = req.user?.role || "admin";
    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action: payload.action,
      module: payload.module,
      targetType: payload.targetType || "",
      targetId: payload.targetId ? String(payload.targetId) : "",
      details: payload.details || {},
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });
  } catch (_err) {}
};
