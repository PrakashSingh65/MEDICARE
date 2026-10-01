import express from "express";
import {
  getRoles,
  upsertRolePermission,
  updateRoleById,
  deleteRoleById,
  updateUserRoleAndPermissions,
  getAuditLogs,
  getNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
  getSystemSettings,
  upsertSystemSettings,
  getSystemReports,
} from "../../controller/admin/systemManagement.controller.js";

const router = express.Router();

router.route("/roles").get(getRoles).post(upsertRolePermission);
router.route("/roles/:id").put(updateRoleById).delete(deleteRoleById);
router.patch("/users/:userId/role", updateUserRoleAndPermissions);

router.get("/audit-logs", getAuditLogs);

router
  .route("/notifications")
  .get(getNotifications)
  .post(createNotification);
router.patch("/notifications/:id/read", markNotificationRead);
router.delete("/notifications/:id", deleteNotification);

router
  .route("/settings")
  .get(getSystemSettings)
  .put(upsertSystemSettings);

router.get("/reports", getSystemReports);

export default router;
