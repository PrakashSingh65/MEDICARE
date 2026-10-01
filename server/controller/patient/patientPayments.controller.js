import mongoose from "mongoose";
import Doctor from "../../model/doctor.model.js";
import Appointment from "../../model/appointment.model.js";
import { Transaction } from "../../model/payment.model.js";
import { Notification } from "../../model/system.model.js";
import { buildInvoicePdfBuffer } from "../../utils/generate-invoice-pdf.js";
import { resolvePatientRecord } from "../../utils/patientResolver.js";

export const payConsultationFee = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const { appointmentId, doctorId, amount, paymentMethod = "upi" } = req.body;
    let appointment = null;
    if (appointmentId && mongoose.Types.ObjectId.isValid(appointmentId)) {
      appointment = await Appointment.findById(appointmentId);
    }

    const resolvedDoctorId = appointment?.doctorId || doctorId;
    const doctor = resolvedDoctorId ? await Doctor.findById(resolvedDoctorId) : null;
    const finalAmount = Number(amount || appointment?.fee || doctor?.fee || 500);
    const platformFee = Number((finalAmount * 0.15).toFixed(2));
    const doctorEarning = Number((finalAmount - platformFee).toFixed(2));

    const transaction = await Transaction.create({
      transactionReference: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appointmentId: appointment?._id,
      patientId: patient._id,
      patientName: patient.name,
      doctorId: doctor?._id || resolvedDoctorId,
      doctorName: doctor?.name || appointment?.doctorName || "Doctor",
      amount: finalAmount,
      platformFee,
      doctorEarning,
      paymentMethod,
      status: "completed",
      paidAt: new Date(),
    });

    if (appointment) {
      appointment.paymentStatus = "paid";
      if (appointment.status === "pending" || appointment.status === "scheduled") {
        appointment.status = "confirmed";
      }
      await appointment.save();
    }

    await Notification.create({
      title: "Consultation Fee Payment Successful",
      message: `Payment of INR ${finalAmount} (${transaction.transactionReference}) was completed successfully.`,
      type: "payment",
      recipientRole: "patient",
      patientId: patient._id,
      doctorId: doctor?._id,
      metadata: {
        transactionId: transaction._id,
        transactionReference: transaction.transactionReference,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Consultation fee paid successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPatientPaymentHistory = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const transactions = await Transaction.find({ patientId: patient._id }).sort({
      paidAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentInvoiceReceipt = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (req.query.format === "pdf") {
      const pdfBuffer = buildInvoicePdfBuffer(transaction);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="INV-${transaction.transactionReference}.pdf"`
      );
      return res.status(200).send(pdfBuffer);
    }

    return res.status(200).json({
      success: true,
      data: {
        invoiceNumber: `INV-${transaction.transactionReference}`,
        transactionReference: transaction.transactionReference,
        patientName: transaction.patientName,
        doctorName: transaction.doctorName,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod,
        status: transaction.status,
        paidAt: transaction.paidAt,
        refund: transaction.refund,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientRefundStatus = async (req, res) => {
  try {
    const patient = await resolvePatientRecord(req, true);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const refundedTransactions = await Transaction.find({
      patientId: patient._id,
      $or: [{ status: "refunded" }, { "refund.isRefunded": true }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: refundedTransactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestPaymentRefund = async (req, res) => {
  try {
    const { refundReason } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    transaction.refund = {
      isRefunded: true,
      refundAmount: transaction.amount,
      refundReason: refundReason || "Requested by patient",
      refundedAt: new Date(),
      refundReference: `REF-${Date.now()}`,
    };
    transaction.status = "refunded";
    await transaction.save();

    if (transaction.appointmentId) {
      await Appointment.findByIdAndUpdate(transaction.appointmentId, {
        paymentStatus: "refunded",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
