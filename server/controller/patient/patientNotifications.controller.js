import mongoose from "mongoose";
import { Notification } from "../../model/system.model.js";
import { resolvePatientRecord } from "../../utils/patientResolver.js";

export const getPatientNotifications = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    const { type, isRead } = req.query;

    const orConditions = [{ recipientRole: { $in: ["all", "patient"] } }];
    if (patient?._id) {
      orConditions.push({ patientId: patient._id });
    }
    if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
      orConditions.push({ recipientId: req.user._id });
    }

    const query = { $or: orConditions };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotificationsByCategory = (categoryTypes) => async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    const orConditions = [{ recipientRole: { $in: ["all", "patient"] } }];
    if (patient?._id) {
      orConditions.push({ patientId: patient._id });
    }
    if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
      orConditions.push({ recipientId: req.user._id });
    }

    const notifications = await Notification.find({
      $or: orConditions,
      type: { $in: categoryTypes },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markPatientNotificationRead = async (req, res) => {
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
