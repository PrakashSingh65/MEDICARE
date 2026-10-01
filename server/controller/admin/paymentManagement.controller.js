import { Transaction, DoctorPayout } from "../../model/payment.model.js";
import Appointment from "../../model/appointment.model.js";
import { recordAudit } from "../../utils/auditLogger.js";

export const getTransactions = async (req, res) => {
  try {
    const {
      status,
      paymentMethod,
      doctorId,
      patientId,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (startDate || endDate) {
      query.paidAt = {};
      if (startDate) query.paidAt.$gte = new Date(startDate);
      if (endDate) query.paidAt.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { transactionReference: { $regex: search, $options: "i" } },
        { patientName: { $regex: search, $options: "i" } },
        { doctorName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ paidAt: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: transactions,
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

export const createTransaction = async (req, res) => {
  try {
    const amount = Number(req.body.amount || 0);
    const platformFee =
      req.body.platformFee !== undefined
        ? Number(req.body.platformFee)
        : Number((amount * 0.15).toFixed(2));
    const doctorEarning =
      req.body.doctorEarning !== undefined
        ? Number(req.body.doctorEarning)
        : Number((amount - platformFee).toFixed(2));

    const transaction = await Transaction.create({
      ...req.body,
      transactionReference:
        req.body.transactionReference || `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amount,
      platformFee,
      doctorEarning,
    });

    if (transaction.appointmentId && transaction.status === "completed") {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "paid",
      });
    }

    await recordAudit(req, {
      action: "CREATE_TRANSACTION",
      module: "payment",
      targetType: "Transaction",
      targetId: transaction._id,
      details: {
        transactionReference: transaction.transactionReference,
        amount: transaction.amount,
        status: transaction.status,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Transaction recorded successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const [summary, byMethod, monthlyBreakdown] = await Promise.all([
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalCompletedRevenue: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
            },
            totalPlatformFees: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$platformFee", 0] },
            },
            totalDoctorEarnings: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$doctorEarning", 0] },
            },
            totalRefundedAmount: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$refund.refundAmount", 0] },
            },
            completedCount: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            refundedCount: {
              $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] },
            },
            failedCount: {
              $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
            },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: "completed" } },
        {
          $group: {
            _id: "$paymentMethod",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: { $in: ["completed", "refunded"] } } },
        {
          $group: {
            _id: {
              year: { $year: "$paidAt" },
              month: { $month: "$paidAt" },
            },
            grossAmount: { $sum: "$amount" },
            platformFee: { $sum: "$platformFee" },
            refundedAmount: { $sum: "$refund.refundAmount" },
            transactionsCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    const payoutSummary = await DoctorPayout.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: summary[0] || {
          totalCompletedRevenue: 0,
          totalPlatformFees: 0,
          totalDoctorEarnings: 0,
          totalRefundedAmount: 0,
          completedCount: 0,
          refundedCount: 0,
          failedCount: 0,
        },
        paymentMethodBreakdown: byMethod,
        monthlyBreakdown,
        payoutSummary,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRefunds = async (req, res) => {
  try {
    const refunds = await Transaction.find({
      $or: [{ status: "refunded" }, { "refund.isRefunded": true }],
    }).sort({ "refund.refundedAt": -1, updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: refunds,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const processRefund = async (req, res) => {
  try {
    const { refundAmount, refundReason } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    if (transaction.status === "refunded") {
      return res.status(400).json({ success: false, message: "Transaction is already refunded" });
    }

    const finalRefundAmount =
      refundAmount !== undefined ? Number(refundAmount) : transaction.amount;

    transaction.status = "refunded";
    transaction.refund = {
      isRefunded: true,
      refundAmount: finalRefundAmount,
      refundReason: refundReason || "Refund processed by administrator",
      refundedAt: new Date(),
      refundReference: `REF-${Date.now()}`,
    };
    await transaction.save();

    if (transaction.appointmentId) {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "refunded",
      });
    }

    await recordAudit(req, {
      action: "PROCESS_REFUND",
      module: "payment",
      targetType: "Transaction",
      targetId: transaction._id,
      details: {
        transactionReference: transaction.transactionReference,
        refundAmount: finalRefundAmount,
        refundReason: transaction.refund.refundReason,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFailedPayments = async (req, res) => {
  try {
    const failedTransactions = await Transaction.find({ status: "failed" }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({
      success: true,
      data: failedTransactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFailedPaymentStatus = async (req, res) => {
  try {
    const { status, failureReason } = req.body;
    if (!["completed", "pending", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: completed, pending, failed",
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status,
        failureReason: status === "failed" ? failureReason || "" : "",
        paidAt: status === "completed" ? new Date() : undefined,
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.appointmentId && status === "completed") {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "paid",
      });
    }

    await recordAudit(req, {
      action: "UPDATE_PAYMENT_STATUS",
      module: "payment",
      targetType: "Transaction",
      targetId: transaction._id,
      details: { status, failureReason },
    });

    return res.status(200).json({
      success: true,
      message: "Payment status updated",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorPayouts = async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const payouts = await DoctorPayout.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDoctorPayout = async (req, res) => {
  try {
    const payout = await DoctorPayout.create(req.body);
    await recordAudit(req, {
      action: "CREATE_DOCTOR_PAYOUT",
      module: "payment",
      targetType: "DoctorPayout",
      targetId: payout._id,
      details: {
        doctorName: payout.doctorName,
        amount: payout.amount,
        status: payout.status,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Doctor payout initiated successfully",
      data: payout,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDoctorPayoutStatus = async (req, res) => {
  try {
    const { status, bankReference, notes } = req.body;
    if (!["pending", "processing", "paid", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payout status. Allowed: pending, processing, paid, failed",
      });
    }

    const payout = await DoctorPayout.findByIdAndUpdate(
      req.params.id,
      {
        status,
        bankReference: bankReference !== undefined ? bankReference : undefined,
        notes: notes !== undefined ? notes : undefined,
        processedAt: status === "paid" ? new Date() : undefined,
      },
      { new: true }
    );

    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout record not found" });
    }

    await recordAudit(req, {
      action: `DOCTOR_PAYOUT_${status.toUpperCase()}`,
      module: "payment",
      targetType: "DoctorPayout",
      targetId: payout._id,
      details: { status, bankReference },
    });

    return res.status(200).json({
      success: true,
      message: `Doctor payout marked as ${status}`,
      data: payout,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
