import Doctor from "../../model/doctor.model.js";
import Patient from "../../model/patient.model.js";
import Appointment from "../../model/appointment.model.js";
import { Transaction } from "../../model/payment.model.js";
import { AuditLog } from "../../model/system.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      activePatients,
      totalDoctors,
      activeDoctors,
      pendingDoctorRegistration,
      unverifiedQualifications,
      suspendedDoctors,
      totalAppointments,
      scheduledAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      disputedAppointments,
      todayAppointments,
      revenueAggregation,
      monthlyRevenue,
      specialtyDistribution,
      recentAuditLogs,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ accountStatus: "active" }),
      Doctor.countDocuments(),
      Doctor.countDocuments({ accountStatus: "active", registrationStatus: "approved" }),
      Doctor.countDocuments({ registrationStatus: "pending" }),
      Doctor.countDocuments({ isQualifiedVerified: false }),
      Doctor.countDocuments({ accountStatus: "suspended" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "scheduled" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Appointment.countDocuments({ $or: [{ status: "disputed" }, { "issue.hasIssue": true }] }),
      Appointment.countDocuments({
        appointmentDate: { $gte: startOfToday, $lte: endOfToday },
      }),
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            grossRevenue: {
              $sum: {
                $cond: [{ $in: ["$status", ["completed", "refunded"]] }, "$amount", 0],
              },
            },
            completedRevenue: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
            },
            platformCommission: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$platformFee", 0] },
            },
            doctorEarnings: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$doctorEarning", 0] },
            },
            refundedTotal: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$refund.refundAmount", 0] },
            },
            failedTransactions: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" },
            },
            revenue: { $sum: "$amount" },
            platformFee: { $sum: "$platformFee" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
      Doctor.aggregate([
        { $group: { _id: "$specialty", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AuditLog.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const rev = revenueAggregation[0] || {
      grossRevenue: 0,
      completedRevenue: 0,
      platformCommission: 0,
      doctorEarnings: 0,
      refundedTotal: 0,
      failedTransactions: 0,
    };

    const completionRate =
      totalAppointments > 0
        ? Number(((completedAppointments / totalAppointments) * 100).toFixed(2))
        : 0;

    const doctorApprovalRate =
      totalDoctors > 0
        ? Number(((activeDoctors / totalDoctors) * 100).toFixed(2))
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        activeDoctors,
        pendingDoctorVerification: {
          pendingRegistrations: pendingDoctorRegistration,
          unverifiedQualifications,
          suspendedDoctors,
        },
        appointments: {
          total: totalAppointments,
          scheduled: scheduledAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          disputed: disputedAppointments,
          today: todayAppointments,
        },
        revenue: {
          grossRevenue: rev.grossRevenue,
          netRevenue: rev.completedRevenue,
          platformCommission: rev.platformCommission,
          doctorEarnings: rev.doctorEarnings,
          totalRefunded: rev.refundedTotal,
          failedTransactions: rev.failedTransactions,
          monthlyTrend: monthlyRevenue,
        },
        platformStatistics: {
          activePatients,
          appointmentCompletionRate: completionRate,
          doctorApprovalRate,
          specialtyDistribution,
          recentAuditLogs,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
