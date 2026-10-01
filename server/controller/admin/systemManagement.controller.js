import {
  RolePermission,
  AuditLog,
  Notification,
  SystemSetting,
} from "../../model/system.model.js";
import User from "../../model/user.model.js";
import Doctor from "../../model/doctor.model.js";
import Patient from "../../model/patient.model.js";
import Appointment from "../../model/appointment.model.js";
import { Transaction } from "../../model/payment.model.js";
import {
  Specialty,
  Department,
  Faq,
  HealthArticle,
  Announcement,
} from "../../model/content.model.js";
import { recordAudit } from "../../utils/auditLogger.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await RolePermission.find().sort({ roleName: 1 });
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertRolePermission = async (req, res) => {
  try {
    const { roleName, description, permissions, isSystemRole } = req.body;
    if (!roleName) {
      return res.status(400).json({ success: false, message: "roleName is required" });
    }

    const role = await RolePermission.findOneAndUpdate(
      { roleName: roleName.toLowerCase().trim() },
      {
        roleName: roleName.toLowerCase().trim(),
        description: description || "",
        permissions: Array.isArray(permissions) ? permissions : [],
        isSystemRole: Boolean(isSystemRole),
      },
      { upsert: true, new: true, runValidators: true }
    );

    await recordAudit(req, {
      action: "UPSERT_ROLE_PERMISSION",
      module: "system",
      targetType: "RolePermission",
      targetId: role._id,
      details: { roleName: role.roleName, permissions: role.permissions },
    });

    return res.status(200).json({
      success: true,
      message: "Role permissions saved",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateRoleById = async (req, res) => {
  try {
    const role = await RolePermission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_ROLE_PERMISSION",
      module: "system",
      targetType: "RolePermission",
      targetId: role._id,
      details: { roleName: role.roleName, permissions: role.permissions },
    });
    return res.status(200).json({
      success: true,
      message: "Role updated",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRoleById = async (req, res) => {
  try {
    const role = await RolePermission.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }
    if (role.isSystemRole) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete a protected system role",
      });
    }
    await role.deleteOne();
    await recordAudit(req, {
      action: "DELETE_ROLE_PERMISSION",
      module: "system",
      targetType: "RolePermission",
      targetId: role._id,
      details: { roleName: role.roleName },
    });
    return res.status(200).json({ success: true, message: "Role deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRoleAndPermissions = async (req, res) => {
  try {
    const { role, permissions, isActive } = req.body;
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await recordAudit(req, {
      action: "UPDATE_USER_ROLE_PERMISSIONS",
      module: "system",
      targetType: "User",
      targetId: user._id,
      details: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "User role and permissions updated",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req, res) => {
  try {
    const { module, action, actorId, startDate, endDate, page = 1, limit = 50 } = req.query;
    const query = {};
    if (module) query.module = module;
    if (action) query.action = { $regex: action, $options: "i" };
    if (actorId) query.actorId = actorId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      AuditLog.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { type, recipientRole, channel, status, isRead } = req.query;
    const query = {};
    if (type) query.type = type;
    if (recipientRole) query.recipientRole = recipientRole;
    if (channel) query.channel = channel;
    if (status) query.status = status;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      status: req.body.status || "sent",
    });

    await recordAudit(req, {
      action: "SEND_NOTIFICATION",
      module: "system",
      targetType: "Notification",
      targetId: notification._id,
      details: {
        title: notification.title,
        recipientRole: notification.recipientRole,
        channel: notification.channel,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    await recordAudit(req, {
      action: "DELETE_NOTIFICATION",
      module: "system",
      targetType: "Notification",
      targetId: notification._id,
      details: { title: notification.title },
    });
    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const settings = await SystemSetting.find(query).sort({ category: 1, key: 1 });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertSystemSettings = async (req, res) => {
  try {
    const items = Array.isArray(req.body.settings) ? req.body.settings : [req.body];
    const results = [];

    for (const item of items) {
      if (!item.key) continue;
      const updated = await SystemSetting.findOneAndUpdate(
        { key: item.key.trim() },
        {
          key: item.key.trim(),
          value: item.value,
          category: item.category || "general",
          description: item.description || "",
        },
        { upsert: true, new: true, runValidators: true }
      );
      results.push(updated);
    }

    await recordAudit(req, {
      action: "UPDATE_SYSTEM_SETTINGS",
      module: "system",
      targetType: "SystemSetting",
      details: { updatedKeys: results.map((r) => r.key) },
    });

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: results,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getSystemReports = async (req, res) => {
  try {
    const [
      doctorsByStatus,
      doctorsByDepartment,
      patientsByPlan,
      patientsByStatus,
      appointmentsByStatus,
      topDoctorsByAppointments,
      revenueByMonth,
      auditLogsByModule,
      contentCounts,
    ] = await Promise.all([
      Doctor.aggregate([
        {
          $group: {
            _id: {
              registrationStatus: "$registrationStatus",
              accountStatus: "$accountStatus",
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Doctor.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 }, avgFee: { $avg: "$fee" } } },
        { $sort: { count: -1 } },
      ]),
      Patient.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Patient.aggregate([{ $group: { _id: "$accountStatus", count: { $sum: 1 } } }]),
      Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Appointment.aggregate([
        {
          $group: {
            _id: { doctorId: "$doctorId", doctorName: "$doctorName" },
            totalAppointments: { $sum: 1 },
            completedAppointments: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            totalFeeGenerated: { $sum: "$fee" },
          },
        },
        { $sort: { totalAppointments: -1 } },
        { $limit: 10 },
      ]),
      Transaction.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" },
              status: "$status",
            },
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      AuditLog.aggregate([
        { $group: { _id: "$module", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Promise.all([
        Specialty.countDocuments(),
        Department.countDocuments(),
        Faq.countDocuments(),
        HealthArticle.countDocuments(),
        Announcement.countDocuments(),
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        generatedAt: new Date(),
        doctors: {
          byStatus: doctorsByStatus,
          byDepartment: doctorsByDepartment,
        },
        patients: {
          byPlan: patientsByPlan,
          byStatus: patientsByStatus,
        },
        appointments: {
          byStatus: appointmentsByStatus,
          topDoctors: topDoctorsByAppointments,
        },
        financials: {
          revenueByMonth,
        },
        contentSummary: {
          specialties: contentCounts[0],
          departments: contentCounts[1],
          faqs: contentCounts[2],
          healthArticles: contentCounts[3],
          announcements: contentCounts[4],
        },
        systemActivity: {
          auditLogsByModule,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
