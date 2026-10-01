import express from "express";
import {
  getTransactions,
  createTransaction,
  getRevenueAnalytics,
  getRefunds,
  processRefund,
  getFailedPayments,
  updateFailedPaymentStatus,
  getDoctorPayouts,
  createDoctorPayout,
  updateDoctorPayoutStatus,
} from "../../controller/admin/paymentManagement.controller.js";

const router = express.Router();

router.route("/transactions").get(getTransactions).post(createTransaction);
router.get("/revenue", getRevenueAnalytics);
router.get("/refunds", getRefunds);
router.post("/transactions/:id/refund", processRefund);
router.get("/failed", getFailedPayments);
router.patch("/transactions/:id/status", updateFailedPaymentStatus);
router.route("/payouts").get(getDoctorPayouts).post(createDoctorPayout);
router.patch("/payouts/:id/status", updateDoctorPayoutStatus);

export default router;
